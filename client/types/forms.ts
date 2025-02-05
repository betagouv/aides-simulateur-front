declare global {

  interface ChoiceItem {
    value: string
    label: string
  }

  type FormSchemaItem = {
    key: string
    title: string
  } & ({
    type: 'boolean'
    default?: boolean
  } | {
    type: 'number'
    default?: number
  } | {
    type: 'string'
    default?: string
    choices?: ChoiceItem[]
  })

  type FormSchema = FormSchemaItem[]
}

export {}
