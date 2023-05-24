import { remultSveltekit } from 'remult/remult-sveltekit';
import { Task } from '../shared/Task';
import { Category } from '../shared/Category';

export const remultApi = remultSveltekit({
	entities: [Task, Category]
});
