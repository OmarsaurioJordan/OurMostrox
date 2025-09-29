import { Mistral } from "@mistralai/mistralai";
import { ApiKeys, loadApiKeys } from "./api_keys";
import { Monster } from "./Monster";
import { buildMonsterPrompt, saveMonster } from "./monster_service";

const PROMISES = new Map<string, Promise<boolean>>();
const DELAY_WAIT_MS = 60000; // milisegundos que espera al servidor

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function limpiaJSON(texto: string): string {
  let raw = texto.replace(/```json|```/g, "").trim();
  raw = raw.replace(/```|```/g, "").trim();
  raw = raw.replace(/{\s+/g, "{").replace("\n{", "{");
  raw = raw.replace(/\s+}/g, "}").replace("}\n", "}");
  raw = raw.replace(/",[^"]*"/g, '","');
  raw = raw.replace("\n\n", "\n").replace("\n\n", "\n").replace("\n\n", "\n");
  raw = raw.replace("\n", "\\n");
  return raw;
}

export async function fetchMonsterDescription(monster: Monster): Promise<boolean> {
  if (monster.descripcion !== "") {
    return false;
  }
  // si ya hay promesa corriendo para este monstruo, reusar
  if (PROMISES.has(monster.id)) {
    return PROMISES.get(monster.id)!;
  }
  const promise = (async () => {
    const apiKey: ApiKeys | null = await loadApiKeys();
    if (!apiKey) {
      return false;
    }
    const client = new Mistral({ apiKey: apiKey.apiKeyTxt });
    const model = "mistral-large-latest";
    const prompt = await buildMonsterPrompt(monster);
    try {
      const chatResponse = await withTimeout(
        client.chat.complete({
          model, messages: [{ role: "user", content: prompt }],
        }),
        DELAY_WAIT_MS
      );
      const message = chatResponse?.choices?.[0]?.message;
      if (!message || typeof message.content !== "string") {
        console.error("Respuesta Mistral inválida");
        return false;
      }
      let raw = limpiaJSON(message.content);
      console.log("Mistral dice: ", raw);
      // actualizar y guardar monstruo con descripción
      let parsed;
      try {
        parsed = JSON.parse(raw);
      }
      catch (e) {
        console.error("no se pudo parsear: ", e);
        console.error("no se pudo parsear json: ", raw);
        return false;
      }
      monster.descripcion = parsed.txt;
      monster.prompt_img = parsed.img;
      await saveMonster(monster);
      return true;
    }
    catch (err) {
      console.warn("Error timeout de Mistral: ", err);
      return false;
    }
    finally {
      PROMISES.delete(monster.id);
    }
  })();
  PROMISES.set(monster.id, promise);
  return promise;
}

export const basePrompt: string =
`IA esto es un prompt proveniente de un software que crea monstruos
para luego enfrentarlos en lucha e ilustrarlos usando otra IA, el
resultado será visto por un software API, no por un humano, a continuación
se te entregarán las características que definen a un monstruo y vas
a entregar dos resultados siguiendo las instrucciónes listadas abajo.
---
$
---
# Resultado 1:
- crearás una descripción del monstruo utilizando sus características.
- No inventarás, No imaginarás, No alucinarás, solo usa las características.
- ajusta los datos acorde al género, ej: "delgado (masc)" - "delgada (fem)".
- este primer resultado está en español.
- el estilo de escritura debe ser narrativamente agradable de leer, literario.
- puedes escribir las características en cualquier órden que tenga sentido.
- si la característica da varias ópciónes (ej: varios peinados) escoge una al azar.
- las características que influyan en una lucha deben permanecer en el nivel
de poder descrito, para que un monstruo no tenga ventaja sobre otro por las
variaciónes narrativas a pesar de que tengan la misma característica.
---
# Resultado 2:
- usarás la descripción generada en el resultado 1.
- omitirás el nombre del monstruo.
- No inventarás, No imaginarás, No alucinarás, solo usa la descripción.
- puedes omitir cosas que No influyan en la imágen.
- este segundo resultado lo harás en inglés.
- generarás un prompt para que una IA ilustrativa dibuje al monstruo.
- el prompt debe incluir las instrucciónes de estilo dadas en #estilo.
---
## #estilo
- concepto: una figura de monstruo de cuerpo completo.
- dibujo con trazos tipo cartoon / cómic hechos a mano.
- fondo borroso monocromático, como de carta coleccionable.
- atmósfera con un toque oscura, de terror, siniestra, con colores fríos.
- renderizado estilizado, alto contraste, alta definición.
- debe tener relación de aspecto 4:5.
---
## Los resultados serán entregados con las siguientes condiciónes:
- No formato markdown, nada de \`\`\`, No **, No subrrayado, No itálica.
- No comentarios extra, nada de \"quieres que ahora te haga...\" o \"aquí tengo tus resultados...\".
- en el siguiente formato JSON válido:
{
  "txt": "aquí el resultado 1",
  "img": "aquí el resultado 2"
}`;
