import Editor from '@monaco-editor/react';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import ILetter from 'src/models/Letter';
import ITopic from 'src/models/Topic';
import LetterContext from '../../contexts/LetterContext';
import TopicSelector from '../TopicSelector/TopicSelector';
import './LetterEditor.css';

const LetterEditor = ({
  replyTo,
  closeDialog,
}: {
  replyTo: ILetter | null;
  closeDialog: () => void;
}) => {
  const [subject, setSubject] = useState<string>(
    replyTo ? `Re: ${replyTo.subject}` : ''
  );
  const [content, setContent] = useState<string>('');
  const [topics, setTopics] = useState<ITopic[]>(
    replyTo ? replyTo?.topics ?? [] : []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { postLetter, showSnackbar } = useContext(LetterContext);

  const submit = () => {
    if (loading) return;
    setLoading(true);

    postLetter({
      reply_id: replyTo?.id ?? undefined,
      subject,
      content,
      topics: topics.map((t) => t.id),
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
      <div className="editor-topics">
        <TopicSelector
          selectedTopics={topics}
          onTopicsChanged={(topics) => {
            setTopics(topics);
          }}
        />
      </div>
      <div className="editor-border">
        <Editor
          height="500px"
          defaultLanguage="markdown"
          // theme="vs-dark"
          options={{ fontSize: 15 }}
          defaultValue="Write your message here!"
          onChange={(value, event) => setContent('' + value)}
        />
      </div>
      <Button
        disabled={loading || content === '' || subject === ''}
        onClick={() => submit()}
        variant="outlined"
        fullWidth={true}
      >
        {loading ? <CircularProgress /> : 'Send'}
      </Button>
    </div>
  );
};

export default LetterEditor;
