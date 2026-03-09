import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditAuditorium = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [auditoriumName, setAuditoriumName] = useState("");
    const [location, setLocation] = useState("");
    const [ownerContact, setOwnerContact] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [pricePerHour, setPricePerHour] = useState("");
    const [overtimePrice, setOvertimePrice] = useState("");
    const [acType, setAcType] = useState("");
    const [description, setDescription] = useState("");
    const [openingTime, setOpeningTime] = useState("");
    const [closingTime, setClosingTime] = useState("");
    const [cancellationPolicy, setCancellationPolicy] = useState("");
    const [images, setImages] = useState([]); // For existing/new previews
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const API_BASE_URL = "https://event-management-szqn.onrender.com";

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`/fetchAuditoriumById/${serviceId}`);
                const data = response.data.data;
                if (data) {
                    setAuditoriumName(data.auditoriumName || "");
                    setLocation(data.location || "");
                    setOwnerContact(data.ownerContact || "");
                    setCapacity(data.capacity || "");
                    setPrice(data.price || "");
                    setPricePerHour(data.pricePerHour || "");
                    setOvertimePrice(data.overtimePrice || "");
                    setAcType(data.acType || "");
                    setDescription(data.description || "");
                    setOpeningTime(data.openingTime || "");
                    setClosingTime(data.closingTime || "");
                    setCancellationPolicy(data.cancellationPolicy || "");
                    setExistingImages(data.images || []);
                }
            } catch (error) {
                console.error("Error fetching auditorium:", error);
                alert("Failed to load service data");
            } finally {
                setFetching(false);
            }
        };
        fetchService();
    }, [serviceId]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length + existingImages.length > 4) {
            alert("You can have only 4 images in total.");
            return;
        }
        const previewImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...previewImages]);
    };

    const removeNewImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("auditoriumName", auditoriumName);
        formData.append("location", location);
        formData.append("ownerContact", ownerContact);
        formData.append("capacity", capacity);
        formData.append("pricePerDay", price);
        formData.append("pricePerHour", pricePerHour);
        formData.append("overtimePrice", overtimePrice);
        formData.append("acType", acType);
        formData.append("description", description);
        formData.append("openingTime", openingTime);
        formData.append("closingTime", closingTime);
        formData.append("cancellationPolicy", cancellationPolicy);
        formData.append("category", "auditorium");

        // We send back the remaining existing images
        formData.append("remainingImages", JSON.stringify(existingImages));

        images.forEach((img) => {
            formData.append("images", img.file);
        });

        try {
            await axios.put(`/editAuditorium/${serviceId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Auditorium updated successfully!");
            navigate("/provider/my-services");
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Something went wrong during update.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-6 text-center">Loading service data...</div>;

    return (
        <div className="p-6 w-full">
            <h2 className="text-3xl font-semibold mb-6 text-gray-600">
                Update Auditorium
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl border border-gray-200"
            >
                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Auditorium Name</label>
                    <input
                        type="text"
                        value={auditoriumName}
                        onChange={(e) => setAuditoriumName(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Owner Contact</label>
                    <input
                        type="text"
                        value={ownerContact}
                        onChange={(e) => setOwnerContact(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Capacity</label>
                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Price per Day (₹)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Price per Hour (₹)</label>
                    <input
                        type="number"
                        value={pricePerHour}
                        onChange={(e) => setPricePerHour(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Overtime Price per Hour (₹)</label>
                    <input
                        type="number"
                        value={overtimePrice}
                        onChange={(e) => setOvertimePrice(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">AC Type</label>
                    <select
                        value={acType}
                        onChange={(e) => setAcType(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    >
                        <option value="">Select</option>
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non AC</option>
                    </select>
                </div>

                <div className="flex flex-col md:col-span-2">
                    <label className="font-semibold mb-1 text-gray-500">Description</label>
                    <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col md:col-span-2">
                    <label className="font-semibold mb-1 text-gray-500">Cancellation Policy</label>
                    <textarea
                        rows={4}
                        value={cancellationPolicy}
                        onChange={(e) => setCancellationPolicy(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Opening Time</label>
                    <input
                        type="time"
                        value={openingTime}
                        onChange={(e) => setOpeningTime(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-gray-500">Closing Time</label>
                    <input
                        type="time"
                        value={closingTime}
                        onChange={(e) => setClosingTime(e.target.value)}
                        required
                        className="border p-3 rounded-xl"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="font-semibold mb-2 text-gray-500 block">Existing & New Images (Max 4)</label>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        {/* Existing Images */}
                        {existingImages.map((img, index) => (
                            <div key={`existing-${index}`} className="relative group">
                                <img
                                    src={`${API_BASE_URL}/${img.replace(/\\/g, "/").replace("public/", "")}`}
                                    alt="existing"
                                    className="h-24 w-full object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(index)}
                                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-90 hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        {/* New Previews */}
                        {images.map((img, index) => (
                            <div key={`new-${index}`} className="relative group border-2 border-cyan-500 rounded-lg">
                                <img
                                    src={img.preview}
                                    alt="new-preview"
                                    className="h-24 w-full object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(index)}
                                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-90 hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="md:col-span-2 bg-cyan-600 text-white py-3 rounded-xl font-semibold"
                >
                    {loading ? "Updating..." : "Update Auditorium"}
                </button>
            </form>
        </div>
    );
};

export default EditAuditorium;
