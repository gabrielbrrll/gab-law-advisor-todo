class RankStringUniquenessError extends Error {
  constructor(message = 'Rank string is not unique') {
    super(message);
    this.name = 'RankStringUniquenessError';
  }
}

export default RankStringUniquenessError;
