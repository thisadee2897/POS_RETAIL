import React, { useState } from "react";
import { Image, Icon } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import imageCompression from "browser-image-compression";

const ProductImageUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const handleImageUpload = async (e) => {
        const imageFile = e.target.files[0];

        try {
            // Generate a new filename with date and time
            const currentDate = new Date();
            const timestamp = currentDate.getTime();
            const originalFilename = imageFile.name;
            const fileExtension = originalFilename.split(".").pop();
            const newFilename = `${timestamp}.${fileExtension.substring(0, 10)}`;
            const renamedImageFile = new File([imageFile], newFilename, { type: imageFile.type });
            setSelectedImage(renamedImageFile);
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            const compressedImage = await imageCompression(renamedImageFile, options);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(compressedImage);
        } catch (error) {
            console.error("Image compression error:", error);
        }
    };

    const handleDeleteImage = () => {
        setSelectedImage(null);
        setPreviewImage("");
    };

    return (
        <div className="col" style={{ width: "300px", textAlign: "center", justifyContent: "center", alignItems: "center", paddingTop: "15px" }}>
            <p>รูปสินค้า :</p>
            <label htmlFor="upload-input">
                {previewImage ? (
                    <div style={{ position: 'relative', width: '170px', height: '170px', cursor: 'pointer', borderRadius: '20px', overflow: 'hidden' }}>
                        <Image src={previewImage} size='small' style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        <Icon>
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    position: 'absolute',
                                    top: '7px',
                                    right: '7px',
                                    color: 'black',
                                    cursor: 'pointer',
                                    backgroundColor: 'white',
                                    borderRadius: '100%',
                                    padding: '5px',
                                    fontSize: '30px'
                                }}
                                onClick={handleDeleteImage}
                            />
                        </Icon>

                    </div>
                ) : (
                    <Image src='https://react.semantic-ui.com/images/wireframe/image.png' size='small' style={{ width: '170px', height: '170px', cursor: 'pointer', borderRadius: '20px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                )}
                <input id="upload-input" type="file" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
            {selectedImage && (
                <p style={{ fontSize: '12px' }}>
                    <br />
                    ชื่อไฟล์: {selectedImage.name}
                    <br />
                    ขนาด: {Math.round(selectedImage.size / 1024)} KB
                </p>
            )}
        </div>
    );
};

export default ProductImageUpload;
