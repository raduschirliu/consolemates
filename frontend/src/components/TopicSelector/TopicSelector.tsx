import { Chip, CircularProgress } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import LetterContext from '../../contexts/LetterContext';
import ITopic from '../../models/Topic';

const TopicSelector = ({
  selectedTopics,
  onTopicsChanged,
}: {
  selectedTopics: ITopic[];
  onTopicsChanged: (topics: ITopic[]) => any;
}) => {
  const [allTopics, setAllTopics] = useState<ITopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthValid, getAllTopics } = useContext(LetterContext);

  const isSelected = (topic: ITopic) => {
    return selectedTopics.some(t => t.id === topic.id);
  };

  useEffect(() => {
    onTopicsChanged(selectedTopics);
  }, [selectedTopics, onTopicsChanged]);

  useEffect(() => {
    if (!isAuthValid()) return;
    getAllTopics()
      .then(setAllTopics)
      .catch(alert)
      .finally(() => setLoading(false));
  }, [getAllTopics, isAuthValid]);

  return (
    <div>
      {loading ? <CircularProgress /> : null}
      {allTopics.map((topic: ITopic) => (
        <Chip
          key={topic.id}
          label={topic.name}
          variant={isSelected(topic) ? 'filled' : 'outlined'}
          onClick={() => {
            if (isSelected(topic)) {
              // Deselect
              onTopicsChanged(selectedTopics.filter((t) => t !== topic));
            } else {
              // Select
              onTopicsChanged([...selectedTopics, topic]);
            }
          }}
        />
      ))}
    </div>
  );
};

export default TopicSelector;
