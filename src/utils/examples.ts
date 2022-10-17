import examples from "../../config/examples.json";

function getExampleByKey(key: string) {
  const paths = key.split("_");
  const exampleI = examples.find((example) => example.name === paths[0])!;
  const exampleJ = exampleI.examples.find(
    (example) => example.name === paths[1]
  )!;
  const exampleK = exampleJ.examples.find(
    (example) => example.name === paths[2]
  )!;
  return exampleK;
}

function getHtmlCodeTitle(key: string, lan: Language | null) {
  if (!key || !lan) {
    return "";
  }
  const paths = key.split("_");
  const exampleI = examples.find((example) => example.name === paths[0])!;
  const exampleJ = exampleI.examples.find(
    (example) => example.name === paths[1]
  )!;
  const exampleK = exampleJ.examples.find(
    (example) => example.name === paths[2]
  )!;
  return `${exampleJ.title[lan]} - ${exampleK.title[lan]}`;
}

export { getExampleByKey, getHtmlCodeTitle };
