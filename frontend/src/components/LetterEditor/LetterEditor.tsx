import { Button, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import LetterContext from '../../contexts/LetterContext';

const LetterEditor = () => {
  const [subject, setSubject] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { postLetter, showSnackbar } = useContext(LetterContext);

  const submit = () => {
    if (loading) return;
    setLoading(true);
    postLetter({
      subject,
      content,
      topics: [],
    })
      .catch(alert)
      .finally(() => {
        setLoading(false);
        showSnackbar('sent letter', 2500);
      });
  };

  return (
    <div className="flex flex-col">
      <TextField
        label="Subject"
        variant="outlined"
        onChange={(e) => setSubject(e.target.value)}
        disabled={loading}
        value={subject}
        multiline
      />
      <TextField
        label="Description"
        variant="outlined"
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        value={content}
        multiline
      />
      <Button
        disabled={loading || content === '' || subject === ''}
        onClick={() => submit()}
      >
        Send
      </Button>
    </div>
  );
};

export default LetterEditor;
