import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Grid } from "semantic-ui-react";

enum Section {
  "getting-started" = "Getting Started",
  "faq" = "FAQ",
  "types-and-syntax" = "Types & Syntax",
  "design-choices" = "Design Choices",
  "implementation" = "Implementation",
  "roadmap" = "Roadmap"
}

export default ({  }: {}) => {
  const [section, setSection] = React.useState(Object.keys(Section)[0]);

  const [md, setMd] = React.useState("");

  React.useEffect(() => {
    (async () => {
      setMd(await (await fetch(`./${section}.md`)).text());
    })();
  }, [section]);

  return (
    <div style={{}}>
      <Grid columns={2} fluid stackable>
        <Grid.Column width={2} style={{ minWidth: 200 }}>
          <ul>
            {Object.entries(Section).map(([key, value]) => (
              <li
                style={{
                  opacity: key === section ? 1 : 0.5,
                  cursor: "pointer"
                }}
                onClick={() => setSection(key)}
                key={key}
              >
                {value}
              </li>
            ))}
          </ul>
        </Grid.Column>
        <Grid.Column width={12} style={{ overflow: "hidden", minHeight: 600 }}>
          <ReactMarkdown source={md} linkTarget={"_blank"} />
        </Grid.Column>
      </Grid>
    </div>
  );
};
