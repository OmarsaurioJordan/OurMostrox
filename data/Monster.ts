export interface Monster {
  id: string;
  nombre: string;
  genero: 0 | 1;
  descripcion: string;
  prompt_img: string;
  parametros: number[];
}
