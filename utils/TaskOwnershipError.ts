export class TaskOwnershipError extends Error {
  constructor(message?: string) {
    super(message || 'Task not found or not owned by the user');
    this.name = 'TaskOwnershipError';
  }
}
