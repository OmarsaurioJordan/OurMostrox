import { Mistral } from "@mistralai/mistralai";
import { loadApiKeys, ApiKeys } from "./api_keys";
import { Monster } from "./Monster";
import { saveMonster } from "./monster_service";

const PROMISES = new Map<string, Promise<string>>();

export async function fetchMonsterDescription(monster: Monster): Promise<string | null> {
  if (monster.descripcion !== "") {
    return null;
  }
  // si ya hay promesa corriendo para este monstruo, reusar
  if (PROMISES.has(monster.id)) {
    return PROMISES.get(monster.id)!;
  }
  const promise = (async () => {
    const apiKey: ApiKeys | null = await loadApiKeys();
    if (!apiKey) {
      throw new Error("No hay API Key configurada");
    }
    const client = new Mistral({ apiKey.apiKeyTxt });
    const model = "mistral-large-latest";

    const prompt = monster.prompt_img;

    const chatResponse = await client.chat.complete({
      model,
      messages: [{ role: "user", content: prompt }],
    });

    const desc = chatResponse.choices[0].message.content;

    // actualizar y guardar monstruo con descripción
    monster.descripcion = desc;
    await saveMonster(monster);

    PROMISES.delete(monster.id); // limpiar cache

    return desc;
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
Los resultados serán entregados en el siguiente formato:

txt = ["aquí el resultado 1"]
img = ["aquí el resultado 2"]

Sin formato markdown y sin comentarios extra, nada de
\"quieres que ahora te haga...\" o \"aquí tengo tus resultados...\"`;
