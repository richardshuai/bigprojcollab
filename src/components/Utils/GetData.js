export const getData = comment => {
  const uniqueKey = comment.uniqueKey;
  const start = comment.start;
  const end = comment.end;
  const quoted = comment.quoted;
  const tags = comment.tags;
  const timeStamp = comment.timeStamp;
  const suggestion = comment.suggestion;
  const isFocused = comment.isFocused;

  const data = {
    uniqueKey,
    start,
    end,
    quoted,
    tags,
    timeStamp,
    suggestion,
    isFocused
  };
  return data;
};
