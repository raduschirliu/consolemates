import { Chip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import LetterContext from '../../contexts/LetterContext';
import ITopic from '../../models/Topic';

const TopicSelector = () => {
  const [selectedTopics, setSelectedTopics] = useState<ITopic[]>([]);
  const [allTopics, setAllTopics] = useState<ITopic[]>([]);
  const { getAllTopics } = useContext(LetterContext);

  useEffect(() => {
    getAllTopics().then(setAllTopics).catch(alert);
  }, [getAllTopics]);

  return (
    <div>
      {allTopics.map((topic: ITopic) => (
        <Chip
          label={topic.name}
          variant={selectedTopics.includes(topic) ? 'filled' : 'outlined'}
          onClick={() => {
            if (selectedTopics.includes(topic)) {
              // Deselect
              setSelectedTopics((prev) => prev.filter((t) => t !== topic));
            } else {
              // Select
              setSelectedTopics((prev) => [...prev, topic]);
            }
          }}
        />
      ))}
    </div>
  );
};

export default TopicSelector;
