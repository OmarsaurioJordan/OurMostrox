import { Mistral } from "@mistralai/mistralai";
import { ApiKeys, loadApiKeys } from "./api_keys";
import { agregarElemento } from "./historial";
import { Monster } from "./Monster";
import { buildMonsterPrompt, saveMonster } from "./monster_service";
import { ParamOption, TERRENOS } from "./parametros";

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
  raw = raw.replace(/\n+/g, "\n");
  raw = raw.replace(/\n/g, "\\n");
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

export function getFightPrompt(monsterA: Monster, monsterB: Monster, escenario: number): string {
  let txt = fightPrompt.replace("$A", monsterA.nombre + ": " + monsterA.descripcion);
  txt = txt.replace("$B", monsterB.nombre + ": " + monsterB.descripcion);
  const terreno: ParamOption = TERRENOS.find(t => t.id === escenario)!;
  return txt.replace("$E", terreno.nombre + ": " + terreno.descripcion);
}

export function getFightId(monsterA: Monster, monsterB: Monster, escenario: number): string {
  return monsterA.id + "-" + monsterB.id + "-" + escenario;
}

export async function fetchMonsterFight(monsterA: Monster, monsterB: Monster, escenario: number): Promise<boolean> {
  const id = getFightId(monsterA, monsterB, escenario);
  if (monsterA.descripcion === "" || monsterB.descripcion === "") {
    return false;
  }
  // si ya hay promesa corriendo para este monstruo, reusar
  if (PROMISES.has(id)) {
    return PROMISES.get(id)!;
  }
  const promise = (async () => {
    const apiKey: ApiKeys | null = await loadApiKeys();
    if (!apiKey) {
      return false;
    }
    const client = new Mistral({ apiKey: apiKey.apiKeyTxt });
    const model = "mistral-large-latest";
    const prompt = getFightPrompt(monsterA, monsterB, escenario);
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
      // procesar el resultado
      await agregarElemento(id, message.content);
      return true;
    }
    catch (err) {
      console.warn("Error timeout de Mistral: ", err);
      return false;
    }
    finally {
      PROMISES.delete(id);
    }
  })();
  PROMISES.set(id, promise);
  return promise;
}

export const basePrompt: string =
`IA esto es un prompt proveniente de un software que crea monstruos para luego enfrentarlos en lucha e ilustrarlos usando otra IA, el resultado será visto por un software API, no por un humano, a continuación se te entregarán las características que definen a un monstruo y vas a entregar dos resultados siguiendo las instrucciónes listadas abajo.
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
de poder descrito, para que un monstruo no tenga ventaja sobre otro por las variaciónes narrativas a pesar de que tengan la misma característica.
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
- No formato markdown, nada de ''', Ni * *, Ni subrrayado, Ni itálica.
- No comentarios extra, nada de "quieres que ahora te haga..." o "aquí tengo tus resultados...".
- en el siguiente formato JSON válido:
{
  "txt": "aquí el resultado 1",
  "img": "aquí el resultado 2"
}`;

export const fightPrompt: string =
`IA esto es un prompt proveniente de un software que enfrenta monstruos en lucha, a continuación se te entregarán las características de la contienda y vas a entregar el resultado siguiendo las instrucciónes listadas abajo.
---
# Reglas de lucha:
- harás un análisis profundo, lógico, profesional, creativo y detallado de una pelea entre los oponentes A y B en el escenario dado.
- la aplicación es para un público adulto y maduro, por lo que puedes describir daño realista, gore, amputación, en general los oponentes luchan a muerte destrozándose.
- No inventarás, No imaginarás, No alucinarás, solo usa los datos que se te proporcionan.
- los nombres de los monstruos No afectan, ejemplo: si se llama "invencible" No significa que lo sea.
- si un personaje tiene la habilidad de camuflaje, ten en cuenta que será pre-adaptada al escenario elegido.
- el tamaño de los personajes es similar, tallas humanoides, si un personaje se describe como gigante, a lo mucho será un 150% el tamaño promedio (es decir un poco más grande), si tiene piernas largas eso también añadirá un poco de altura claramente.
- ten en cuenta que los poderes y habilidades No deben ser ilimitados, obedecen a cansancio o limitaciónes de energía o tiempos de recarga.
- los compañeros extra o ayudantes deben tener una influencia baja en la contienda, ejemplo: un perro será de pequeño tamaño, para evitar que sea un ítem de peso decicivo.
- los poderes o habilidades No serán exageradas, ejemplo: si tiene la habilidad de movimiento veloz, esta No debe asumirse que es como la del Flash de DC cómics, eso sería muy exagerado.
- puedes hacer que el escenario influya mucho, por ejemplo, con objetos que utilizar o tranceuntes que se crucen en la lucha si es en una ciudad.
- solo si los nombres de los oponentes son exactamente iguales, puedes usar algún distintivo, por ejemplo: Pepe-A vs Pepe-B.
---
# Oponente A:
$A
---
# Oponente B:
$B
---
# Escenario:
$E
---
## Resultado esperado:
- No formato markdown, nada de ''', Ni * *, Ni subrrayado, Ni itálica.
- No comentarios extra, nada de "quieres que ahora te haga..." o "aquí tengo tus resultados...".
- No incluirá análisis individual de cada personaje, nada de describir pros y contras, solo importa la narrativa de la lucha.
- el encabezado del resultado será: nombre_A vs nombre_B en nombre_escenario.
- la narrativa incluirá: inicio de la contienda - punto intermedio o clímax - final con una fatality que permita mostrar claramente al ganador.
- la narrativa al final incluirá: el porcentaje de daño recibido por cada uno de los oponentes - el porcentaje probabilístico que tenía cada uno de ganar la pelea.`;
