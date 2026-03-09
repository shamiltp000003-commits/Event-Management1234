import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditCatering = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [location, setLocation] = useState("");
    const [packages, setPackages] = useState([]);
    const [packageName, setPackageName] = useState("");
    const [foodType, setFoodType] = useState("veg");
    const [pricePerPerson, setPricePerPerson] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const API_BASE_URL = "https://event-management-szqn.onrender.com";

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`/fetchCateringById/${serviceId}`);
                const data = response.data.data;
                if (data) {
                    setCompanyName(data.companyName || "");
                    setOwnerName(data.ownerName || "");
                    setContactNumber(data.contactNumber || "");
                    setLocation(data.location || "");
                    setPackages(data.packages || []);
                    setExistingImages(data.images || []);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to load service");
            } finally {
                setFetching(false);
            }
        };
        fetchService();
    }, [serviceId]);

    const addPackage = () => {
        if (!packageName || !pricePerPerson) {
            alert("Fill package name and price");
            return;
        }
        setPackages((prev) => [
            ...prev,
            { id: Date.now(), packageName, foodType, pricePerPerson, description },
        ]);
        setPackageName("");
        setFoodType("veg");
        setPricePerPerson("");
        setDescription("");
    };

    const removePackage = (id) => {
        setPackages(packages.filter((p) => p.id !== id));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length + existingImages.length > 4) {
            alert("Max 4 images total");
            return;
        }
        setImages((prev) => [
            ...prev,
            ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
        ]);
    };

    const removeNewImage = (index) => setImages(images.filter((_, i) => i !== index));
    const removeExistingImage = (index) => setExistingImages(existingImages.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("companyName", companyName);
            formData.append("ownerName", ownerName);
            formData.append("contactNumber", contactNumber);
            formData.append("location", location);
            formData.append("packages", JSON.stringify(packages));
            formData.append("category", "catering");
            formData.append("remainingImages", JSON.stringify(existingImages));

            images.forEach((img) => formData.append("images", img.file));

            await axios.put(`/editCatering/${serviceId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Catering Service Updated");
            navigate("/provider/my-services");
        } catch (error) {
            console.error(error);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-7xl w-full mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-600">Update Catering Service</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl">
                <div className="grid md:grid-cols-2 gap-4">
                    <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="border p-3 rounded-xl" />
                    <input placeholder="Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="border p-3 rounded-xl" />
                    <input placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="border p-3 rounded-xl" />
                    <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-3 rounded-xl" />
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-bold text-lg mb-4 text-gray-600">Add Package</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input placeholder="Package Name" value={packageName} onChange={(e) => setPackageName(e.target.value)} className="border p-3 rounded-xl" />
                        <select value={foodType} onChange={(e) => setFoodType(e.target.value)} className="border p-3 rounded-xl">
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non-Veg</option>
                            <option value="both">Veg & Non-Veg</option>
                        </select>
                        <input type="number" placeholder="Price per Person (₹)" value={pricePerPerson} onChange={(e) => setPricePerPerson(e.target.value)} className="border p-3 rounded-xl" />
                        <textarea placeholder="Package Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-3 rounded-xl" />
                    </div>
                    <button type="button" onClick={addPackage} className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-xl">+ Add Package</button>
                </div>

                {packages.map((pkg, idx) => (
                    <div key={idx} className="flex justify-between bg-gray-100 p-3 rounded-xl">
                        <span>{pkg.packageName} | {pkg.foodType} | ₹{pkg.pricePerPerson}/person</span>
                        <button type="button" onClick={() => removePackage(pkg.id || idx)} className="text-red-600">Remove</button>
                    </div>
                ))}

                <div>
                    <label className="font-semibold mb-2 block text-gray-600">Images (Max 4 Total)</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        {existingImages.map((img, idx) => (
                            <div key={`idx-${idx}`} className="relative">
                                <img src={`${API_BASE_URL}/${img.replace(/\\/g, "/").replace("public/", "")}`} alt="existing" className="h-24 w-full object-cover rounded-lg border" />
                                <button type="button" onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">✕</button>
                            </div>
                        ))}
                        {images.map((img, idx) => (
                            <div key={`new-${idx}`} className="relative border-2 border-cyan-500 rounded-lg">
                                <img src={img.preview} alt="new" className="h-24 w-full object-cover rounded-lg" />
                                <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">✕</button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full bg-cyan-600 text-white py-3 rounded-xl text-lg font-semibold">
                    {loading ? "Updating..." : "Update Catering Service"}
                </button>
            </form>
        </div>
    );
};

export default EditCatering;
