import { Typography } from '@mui/material';
import { PieChart } from 'react-minimal-pie-chart';
import { LabelRenderProps } from 'react-minimal-pie-chart/types/Label';
import IStats from 'src/models/Stats';
import './LetterStats.css';

const LetterStats = ({ stats }: { stats: IStats }) => {
  const data = [
    { title: 'Angry', value: stats.angry, color: '#2B0F66' },
    { title: 'Sad', value: stats.sad, color: '#00A1D5' },
    { title: 'Happy', value: stats.sad, color: '#FF86C9' },
    { title: 'Surprise', value: stats.surprise, color: '#F500BD' },
    { title: 'Fear', value: stats.fear, color: '#00BE68' },
  ];

  const total =
    stats.angry + stats.happy + stats.sad + stats.surprise + stats.fear;

  return (
    <div className="stats-container">
      <PieChart
        animate={true}
        labelStyle={{
          fontSize: '3px',
          fontFamily: "'Source Code Pro', monospace",
        }}
        label={(renderProps: LabelRenderProps) => {
          const percentage =
            Math.round(
              (renderProps.dataEntry.percentage + Number.EPSILON) * 100
            ) / 100;

          return percentage === 0
            ? ''
            : `${renderProps.dataEntry.title} (${percentage}%)`;
        }}
        data={data}
      />
      <Typography variant="body1">Total letters: {total}</Typography>
    </div>
  );
};

export default LetterStats;
