import { Button } from '@mui/material';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopicSelector from '../components/TopicSelector/TopicSelector';
import LetterContext from '../contexts/LetterContext';
import ITopic from '../models/Topic';

const UserPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [topics, setTopics] = useState<ITopic[]>([]);
  const { isAuthValid, getUserTopics, updateUserTopics, showSnackbar } =
    useContext(LetterContext);

  useEffect(() => {
    if (!isAuthValid()) return;
    getUserTopics().then(setTopics).catch(alert);
  }, [getUserTopics, isAuthValid, setTopics]);

  return (
    <div>
      <Link to="/app">Back</Link>
      <TopicSelector
        selectedTopics={topics}
        onTopicsChanged={(topics) => {
          console.log(topics);
          setTopics(topics);
        }}
      />
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          updateUserTopics(topics)
            .catch(alert)
            .finally(() => {
              showSnackbar('Updated selected topics', 2500);
              setLoading(false);
            });
        }}
      >
        Update
      </Button>
    </div>
  );
};

export default UserPage;
