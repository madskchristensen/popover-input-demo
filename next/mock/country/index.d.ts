export interface CarBrand {
  id: string
  title: string
  carModels?: CarModel[]
}

export interface CarModel {
  id: string
  title: string
  carModels?: CarModel[]
}

export type CarVersion = {
  id: string
  title: string
}
