import { AmountException } from "../exceptions";
import ValueObject from "./value-object";

interface AmountProps {
    value: number;
}

/**
 * Value Object para manejar montos en pesos 
 */
export class Amount extends ValueObject<AmountProps> {
    private constructor(private readonly value: number) {
        super({ value });
    }

    /**
     * Crea un Amount en pesos colombianos
     * @param value - Valor en pesos (ej: 1500, 2500.50, etc.)
     */
    public static create(value: number | string): Amount {
        let numericValue: number;

        if (typeof value === 'string') {
            // Limpiar formato
            const cleaned = value.replace(/[.\s]/g, '').replace(',', '.');
            numericValue = parseFloat(cleaned);
        } else {
            numericValue = value;
        }

        Amount.validate(numericValue);
        return new Amount(numericValue);
    }

    private static validate(value: number): void {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value) || value < 0) {
            throw new AmountException('El monto debe ser un número positivo válido en pesos colombianos');
        }
    }

    /**
     * Suma dos montos
     */
    public add(other: Amount): Amount {
        return new Amount(this.value + other.value);
    }

    /**
     * Resta dos montos
     */
    public subtract(other: Amount): Amount {
        const result = this.value - other.value;
        if (result < 0) {
            throw new AmountException('El resultado no puede ser negativo');
        }
        return new Amount(result);
    }

    /**
     * Verifica si es menor que otro monto
     */
    public isLessThan(other: Amount): boolean {
        return this.value < other.value;
    }

    /**
     * Verifica si es mayor que otro monto
     */
    public isGreaterThan(other: Amount): boolean {
        return this.value > other.value;
    }

    /**
     * Verifica si es igual a otro monto
     */
    public equals(other: Amount): boolean {
        return this.value === other.value;
    }

    /**
     * Obtiene el valor en pesos colombianos
     */
    public get getValue(): number {
        return this.value;
    }

    /**
     * Convierte a string simple
     */
    public toString(): string {
        return this.value.toString();
    }

    /**
     * Formato para pesos colombianos con separadores
     * @returns Formato: $1.500.000 COP
     */
    public toFormattedString(): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(this.value);
    }
}