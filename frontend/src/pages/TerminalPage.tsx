// import ReactTerminal from 'react-terminal-component';
// import {
//   CommandMapping,
//   OutputFactory,
//   EmulatorState,
//   defaultCommandMapping,
// } from 'javascript-terminal';
import Terminal from 'terminal-in-react';

// const emulatorState = EmulatorState.create({
//   commandMapping: CommandMapping.create({
//     test: {
//       function: (state: any, opts: any) => {
//         return {
//           output: OutputFactory.makeTextOutput('asdf'),
//         };
//       },
//       optDef: {},
//     },
//   }),
// });

const TerminalPage = () => {
  return (
    <div>
      {/* <ReactTerminal emulatorState={emulatorState} /> */}
      <Terminal
        color="green"
        backgroundColor="black"
        barColor="black"
        commands={{
          stonks: () => 'stonks',
        }}
      />
    </div>
  );
};

export default TerminalPage;
