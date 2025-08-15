export const analyseComplexity = (data: string) => {
	return `
        Task: 
        Analyze the provided Typescript imports based on the below criteria.
        Consider the imports for each file, but also consider how they interact with each other.

        Input: ${data}
        
        Evaluation Criteria:
            - Dependency complexity (30% weight)
            - Circular dependencies (40% weight)
            - Tightly coupled modules (30% weight)

        Grading Guidelines: 
            - 1-3 (Poor): High complexity, circular dependencies, tight coupling.
            - 4-6 (Moderate): No circular dependencies, some issues with complexity and coupling.
            - 7-10 (Good): No circular depedencies, minimal issues, well-structured.

        Provide refactoring recommendations on each point with one actionable sentence.

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
