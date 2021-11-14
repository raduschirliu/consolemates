import Editor from '@monaco-editor/react';
import { Button, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import LetterContext from '../../contexts/LetterContext';
import './LetterEditor.css';

const LetterEditor = ({ closeDialog }: { closeDialog: () => void }) => {
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
        setContent('');
        setSubject('');
        showSnackbar('Letter sent!', 2500);
        closeDialog();
      });
  };

  return (
    <div className="editor-container">
      <TextField
        label="Subject"
        variant="outlined"
        onChange={(e) => setSubject(e.target.value)}
        disabled={loading}
        value={subject}
        fullWidth={true}
      />
      <div className="editor-border">
        <Editor
          height="500px"
          defaultLanguage="markdown"
          // theme="vs-dark"
          options={{ fontSize: 15 }}
          defaultValue="Write your message here (markdown is supported :)!"
          onChange={(value, event) => setContent('' + value)}
        />
      </div>
      <Button
        disabled={loading || content === '' || subject === ''}
        onClick={() => submit()}
        variant="outlined"
        fullWidth={true}
      >
        Send
      </Button>
    </div>
  );
};

export default LetterEditor;
