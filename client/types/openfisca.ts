export enum Entites {
    Individus = 'individus',
    Menages = 'menages',
    FoyerFiscaux = 'foyers_fiscaux',
    Familles = 'familles'
}

export type VariableValueOnPeriod = {
    [date: string]: boolean | number | string
}

// On VariableValueOnPeriod items, string[] is added to guarantee typing happiness
export type OpenFiscaCalculationRequest = {
    individus: {
        [name: string]: {
            [variable: string]: VariableValueOnPeriod
        }
    }
    menages: {
        [name: string]: {
            personne_de_reference: string[]
            conjoint: string[]
            enfants: string[]
            [variable: string]: string[] | VariableValueOnPeriod
        }
    }
    foyers_fiscaux: {
        [name: string]: {
            declarants: string[]
            personnes_a_charge: string[]
            [variable: string]: string[] | VariableValueOnPeriod
        }
    }
    familles: {
        [name: string]: {
            parents: string[]
            enfants: string[]
            [variable: string]: string[] | VariableValueOnPeriod
        }
    }
}
export type OpenFiscaCalculationResponse = OpenFiscaCalculationRequest | { error: string }
