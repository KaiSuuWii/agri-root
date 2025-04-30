import PropTypes from "prop-types";

const CropInfo = ({ cropName, cropImage }) => {
  return (
    <div className="text-center mb-4">
      <h2 className="text-base text-white font-bold">
        Type of Crop: {cropName}
      </h2>
      <div className="w-32 h-32 mx-auto my-2 rounded-full overflow-hidden bg-white">
        <img
          src={cropImage}
          alt={`${cropName} crop`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

CropInfo.propTypes = {
  cropName: PropTypes.string.isRequired,
  cropImage: PropTypes.string.isRequired,
};

export default CropInfo;
