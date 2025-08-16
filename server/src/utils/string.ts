export const normalizeString = (input: string) =>
	input.replace(/\'/g, '').replace('./', '').replace('.ts', '').replace('.js', '');

export const circularDependencyRecommendation = (linkedModules: string[]): string =>
	`Refactor to remove the circular dependencies between: ${linkedModules.join(', ')}`;

export const dependencyComplexityRecommendationGood = (count: number): string =>
	`Only ${count} dependenc${count === 1 ? 'y' : 'ies'} identified. No recommendations.`;

export const dependencyComplexityRecommendationModerate = (count: number): string =>
	`${count} dependencies identified, consider reducing if possible to keep file maintainable.`;

export const dependencyComplexityRecommendationPoor = (count: number): string =>
	`Too many (${count}) dependencies identified, consider reorganizing functionalities.`;

export const couplingRecommendationGood = (): string =>
	`Low coupling (with only 1) between modules identified. No recommendations`;

export const couplingRecommendationModerate = (): string =>
	`Module coupling can be improved. Consider refactoring for better maintainability.`;

export const couplingRecommendationPoor = (): string =>
	`Module is very tightly coupled with with other such and will be difficult to test and maintain. Recommend to revisit dependency necessity.`;
