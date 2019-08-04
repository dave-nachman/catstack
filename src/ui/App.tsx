import React from "react";
import * as S from "semantic-ui-react";
import { BuiltInFunction } from "../language/types";
import { Code } from "./Code";
import { Environment } from "./Environment";
import Help from "./Help";
import { Stack } from "./Stack";
import { useInterpreter } from "./useInterpreter";

export enum CodeTab {
  "REPL" = "REPL",
  "Editor" = "Editor"
}

const webEnvironment: { [key: string]: BuiltInFunction } = {
  // this is a placeholder - we want print to show up in the environment listing
  // but when we actually call "interpret", we pass another definition
  print: ({ stack, environment }) => ({ stack, environment }),
  input: ({ stack, environment }) => {
    const input = prompt("Enter a value");

    if (input) {
      return {
        stack: stack.concat([{ type: "string", value: input }]),
        environment
      };
    }
    throw new Error("Failed to process input");
  }
};

const brandColor = "rgb(97, 81, 20)";

const App = () => {
  const { interpreter, setInterpreter, undo, redo } = useInterpreter(
    webEnvironment
  );

  return (
    <div>
      <S.Menu inverted style={{ borderRadius: 0, backgroundColor: brandColor }}>
        <S.Container>
          <S.Menu.Item header>
            <span>
              <span style={{ fontSize: 22 }}>Catstack</span>
              <span style={{ marginLeft: 4 }}>
                <S.Label size="mini">Alpha</S.Label>
              </span>
              <span style={{ marginLeft: 12 }}>
                a minimal stack-based programming language for learning
              </span>
            </span>
          </S.Menu.Item>
          <S.Menu.Item>
            <a href="https://github.com/dave-nachman/catstack" target="_blank">
              <S.Image style={{ width: 24 }} src="./github.png" />
            </a>
          </S.Menu.Item>
        </S.Container>
      </S.Menu>

      <S.Container fluid style={{ marginTop: "1em", padding: "12px 16px" }}>
        <S.Tab
          panes={[
            {
              menuItem: "Try it out",
              render: () => {
                return (
                  <S.Grid
                    style={{ marginTop: "0.5rem" }}
                    columns={3}
                    fluid
                    stackable
                  >
                    <S.Grid.Column>
                      <S.Segment style={{ height: "100%" }}>
                        <Code
                          interpreter={interpreter}
                          setInterpreter={setInterpreter}
                          undo={undo}
                          redo={redo}
                        />
                      </S.Segment>
                    </S.Grid.Column>
                    <S.Grid.Column>
                      <S.Segment style={{ height: "100%" }}>
                        <Environment interpreter={interpreter} />
                      </S.Segment>
                    </S.Grid.Column>
                    <S.Grid.Column>
                      <S.Segment style={{ height: "100%" }}>
                        <Stack interpreter={interpreter} />
                      </S.Segment>
                    </S.Grid.Column>
                  </S.Grid>
                );
              }
            },
            {
              menuItem: "Learn",
              render: () => {
                return (
                  <div style={{ marginTop: "1rem" }}>
                    <Help />
                  </div>
                );
              }
            }
          ]}
        />
      </S.Container>

      <S.Segment
        inverted
        vertical
        style={{
          margin: "1em 0em 0em",
          padding: "1em 1em",
          backgroundColor: brandColor,
          whitespace: "pre" // keep multiple spaces in text
        }}
      >
        Made by Dave Nachman{"   "}|{"   "}feedback@catstack.org
      </S.Segment>
    </div>
  );
};

export default App;
