# Our Mostrox

Software movil React Native con Expo, creado por Omwekiatl para una clase de desarrollo móvil, se trata de un creador y enfrentador de monstruos donde el usuario elige discretamente las piezas del monstruo, una IA de texto genera su descripción, luego una IA de imágen genera su foto, todo mediante APIs y sus respectivas API keys, finalmente mediante Qr dos monstruos se enfrentan en un escenario aleatorio, esto se hace también mediante la IA textual, lo que arroja una narrativa con porcentajes de daño y probabilidad de ganar para cada uno, puede tener una galería de monstruos en su teléfono.

Este proyecto se ha realizado emulando el desarrollo en Android Studio y luego probándolo en móvil mediante la App de Expo Go. También como es mi primer ejercicio de desarrollo móvil, plataforma a la que no estoy acostumbrado y no pienso especializarme en ello, el desarrollo ha sido guiado por IA de GPT, para acelerar el proceso y aplicando mi discernimiento como programador experimentado.

Como trabajo futuro, se plantea un módulo de mezcla / reproducción de monstruos utilizando también IA, se plantea un modo de guardado en la nube de los monstruos, mediante DB, lo que implica una sesión y cuenta de usuario verificada por correo, de este modo tras las peleas los monstruos podrían quedar en estado de reposo mientras se recuperan o incluso muertos. También podría agregarse alguna funcionalidad para mejorarlos post creación, seguir sus historiales de luchas y reproducción, o someterlos a pruebas con criaturas narrativas en un modo aventura, para diversión de un solo jugador.

[Expo documentation](https://docs.expo.dev/)

```bash
npx expo start -c
```

Tareas:

- creación de la descripción del monstruo mediante IA y API (quedé haciendo prompts.ts API)
- creación de la imágen del monstruo mediante IA y API, a partir de su descripción
- pre enfrentamiento de monstruos, leyendo datos del Qr y eligiendo mapa al azar
- enfrentamiento de monstruos con IA y API, entrega de narrativa
- mejorar navegación go back.
