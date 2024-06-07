export type ExerciseDefinition = {
    title: string,
    description: string,
    type: string,
    lines: string[],
    indicesToMatch?: number[][][],
    expectedLines?: string[],
};
