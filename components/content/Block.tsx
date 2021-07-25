import { FunctionComponent, memo } from "react";
import { MappedBlock } from "../../utilities/wordpress";
import LightboxGallery from "./LightboxGallery";
import StyledImage from "../elements/StyledImage";
import UnsafeHTMLContent from "./UnsafeHTMLContent";

interface IProps {
  block: MappedBlock;
}

const Block: FunctionComponent<IProps> = memo(({ block }) => {
  switch (block.blockName) {
    case null:
      return null;

    case "core/image":
      return <UnsafeHTMLContent content={block.innerHTML} />;
    case "core/gallery":
      return (
        <LightboxGallery
          images={block.attrs.urls}
          imageToUrl={(url) => url}
          imageToPreviewElement={(url) => <StyledImage src={url} />}
        />
      );

    case "core/separator":
      return <hr />;

    case "core/list":
    case "core/paragraph":
    default:
      return <UnsafeHTMLContent content={block.innerHTML} />;
  }
});

export default Block;
