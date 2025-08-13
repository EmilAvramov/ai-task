export const analyseComplexity = (data: string) => {
	return `
        Analyse the complexity of the following Typescript imports: ${data}.
        
        Criteria:
            - Dependency complexity
            - Circular dependencies
            - Tightly coupled modules

        Employ a grading scale from 1 to 10 - 10 loosely coupled code with no circular deps
        and low dependency complexity and 1 being poor code with circular dependencies that is tightly coupled and
        with high dependency complexity

        Provide possible refactoring recommendations on each point with one sentence.

        Return only a JSON with an array of these objects:
        {
            fileName: string
            analysis: [{
                name: 'dependencies' | 'circular' | 'coupling'
                score: number
                recommendation: string
            }]
        }

    `;
};
