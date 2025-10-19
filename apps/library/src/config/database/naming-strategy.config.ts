import { NamingStrategyInterface } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class UppercaseSnakeNamingStrategy
    extends SnakeNamingStrategy
    implements NamingStrategyInterface {
    public tableName(targetName: string, userSpecifiedName: string): string {
        const snakeName: string = super.tableName(targetName, userSpecifiedName);
        return snakeName.toUpperCase();
    }

    public columnName(
        propertyName: string,
        customName: string,
        embeddedPrefixes: string[],
    ): string {
        const snakeName: string = super.columnName(
            propertyName,
            customName,
            embeddedPrefixes,
        );
        return snakeName.toUpperCase();
    }
}
