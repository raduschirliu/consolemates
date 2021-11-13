import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ILetter from '../models/Letter';
import ITopic from '../models/Topic';

interface ILetterContext {
  children: any;
  getUserTopics: () => Promise<ITopic[]>;
  getAllTopics: () => Promise<ITopic[]>;
  updateTopics: (userTopics: ITopic[]) => Promise<any>;
  postLetter: (letter: ILetter) => Promise<any>;
  getNewLetters: () => Promise<ILetter[]>;
  getLetter: (id: string) => Promise<ILetter>;
  showSnackbar: (msg: string, duration: number) => void;
}

interface ISnackbar {
  open: boolean;
  msg: string;
  duration: number;
};

const API_URL = process.env['REACT_APP_API_URL'] || 'localhost:8000';
const LetterContext = React.createContext<ILetterContext>(null as any);

export const LetterProvider = ({ children }: { children: any }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [snackbar, setSnackbar] = useState<ISnackbar>();
  const [authToken, setAuthToken] = useState<string>('invalid');
  const [topics, setTopics] = useState<ITopic[]>([]);

  const getHeaders = () => {
    return { headers: { Authorization: `Bearer ${authToken}` } };
  };

  const getAllTopics = () => {
    if (topics?.length > 0) {
      return Promise.resolve(topics);
    }

    return axios.get(`${API_URL}/topic`, getHeaders()).then((res: any) => {
      const allTopics = res.data as ITopic[];
      setTopics(allTopics);
      console.log('got topics', allTopics);
      return allTopics;
    });
  };

  const getUserTopics = () => {
    return axios
      .get(`${API_URL}/user/topic`, getHeaders())
      .then((res: any) => res.data as ITopic[]);
  };

  const updateTopics = (userTopics: ITopic[]) => {
    return axios.post(`${API_URL}/user`, userTopics, getHeaders());
  };

  const postLetter = (letter: ILetter) => {
    return axios.post(`${API_URL}/letter`, letter, getHeaders());
  };

  const getNewLetters = () => {
    return axios
      .get(`${API_URL}/letter`, getHeaders())
      .then((res: any) => res.data as ILetter[]);
  };

  const getLetter = (id: string) => {
    return axios
      .get(`${API_URL}/letter/${id}`, getHeaders())
      .then((res: any) => res.data as ILetter);
  };

  const showSnackbar = (msg: string, duration: number) => {
    setSnackbar({
      open: true,
      msg,
      duration
    });
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    getAccessTokenSilently().then(setAuthToken).catch(alert);
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (!authToken) return;
    console.log('auth token: ', authToken);
  }, [authToken]);

  return (
    <LetterContext.Provider
      value={{
        children,
        getAllTopics,
        getUserTopics,
        updateTopics,
        postLetter,
        getNewLetters,
        getLetter,
        showSnackbar,
      }}
    >
      {children}
    </LetterContext.Provider>
  );
};

export default LetterContext;
