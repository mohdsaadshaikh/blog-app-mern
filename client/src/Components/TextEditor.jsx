// import { useMemo, useRef } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const TextEditor = ({ content, setContent, images, setImages }) => {
//   const quillRef = useRef(null);

//   // const handleImageUpload = () => {
//   //   const input = document.createElement("input");
//   //   input.type = "file";
//   //   input.accept = "image/*";
//   //   input.onchange = (e) => {
//   //     const file = e.target.files[0];
//   //     const reader = new FileReader();
//   //     reader.onload = (event) => {
//   //       setImages((prevImages) => [...prevImages, event.target.result]);
//   //     };
//   //     reader.readAsDataURL(file);
//   //   };
//   //   input.click();
//   // };

//   const modules = useMemo(
//     () => ({
//       toolbar: {
//         container: [
//           [{ header: "1" }, { header: "2" }, { font: [] }],
//           [{ size: [] }],
//           ["bold", "italic", "underline", "strike", "blockquote"],
//           [
//             { list: "ordered" },
//             { list: "bullet" },
//             { indent: "-1" },
//             { indent: "+1" },
//           ],
//           ["link", "image"],
//           ["clean"],
//         ],
//         handlers: {
//           image: () => {
//             try {
//               const input = document.createElement("input");
//               input.type = "file";
//               input.accept = "image/*";
//               input.onchange = (e) => {
//                 const file = e.target.files[0];
//                 if (!file) return;

//                 const reader = new FileReader();
//                 reader.onload = (event) => {
//                   try {
//                     const imageUrl = event.target.result;
//                     setImages((prevImages) => [...prevImages, imageUrl]);
//                     const quill = quillRef.current.getEditor();
//                     const range = quill.getSelection(true);
//                     quill.insertEmbed(range.index, "image", imageUrl);
//                   } catch (error) {
//                     console.error("Error inserting image:", error);
//                   }
//                 };
//                 reader.onerror = (error) => {
//                   console.error("Error reading file:", error);
//                 };
//                 reader.readAsDataURL(file);
//               };
//               input.click();
//             } catch (error) {
//               console.error("Error in image handler:", error);
//             }
//           },
//         },
//       },
//       clipboard: { matchVisual: false },
//     }),
//     [quillRef, setImages]
//   );

//   return (
//     <ReactQuill
//       theme="snow"
//       className="max-w-[710px] w-[710px] h-full"
//       placeholder="Write something amazing..."
//       modules={modules}
//       ref={quillRef}
//       value={content}
//       // onChange={(value) => setContent(value)}
//       onChange={(value) => {
//         console.log("Content updated:", value);
//         setContent(value);
//       }}
//     />
//   );
// };

// export default TextEditor;

import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ content, setContent }) => {
  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link"],
          ["clean"],
        ],
        // handlers: {
        //   image: () => {
        //     const input = document.createElement("input");
        //     input.type = "file";
        //     input.accept = "image/*";
        //     input.onchange = async (e) => {
        //       const file = e.target.files[0];
        //       if (!file) return;

        //       try {
        //         const imageUrl = await handleImageUpload(file);
        //         if (imageUrl) {
        //           const quill = quillRef.current.getEditor();
        //           const range = quill.getSelection(true);
        //           quill.insertEmbed(range.index, "image", imageUrl);
        //         }
        //       } catch (error) {
        //         console.error("Error uploading image:", error);
        //       }
        //     };
        //     input.click();
        //   },
        // },
      },
      clipboard: { matchVisual: false },
    }),
    []
  );

  return (
    <ReactQuill
      theme="snow"
      className="max-w-[710px] w-[710px] h-full"
      placeholder="Write something amazing..."
      modules={modules}
      ref={quillRef}
      value={content}
      onChange={(value) => {
        setContent(value);
      }}
    />
  );
};

export default TextEditor;
