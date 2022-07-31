export interface Person {
  index: number
  name: string
}

export interface ItemPerson extends Person {
  paid: number
  toPay: number
}

export interface Item {
  name: string
  persons: ItemPerson[]
  note: string
}

export interface ItemAddedId extends Item {
  _id: string
}
