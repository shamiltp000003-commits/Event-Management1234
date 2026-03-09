import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditStageDecoration = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setDescription] = useState("");
    const [decorations, setDecorations] = useState([]);

    const [decTitle, setDecTitle] = useState("");
    const [decDescription, setDecDescription] = useState("");
    const [decCategory, setDecCategory] = useState("Affordable");
    const [decPricePerDay, setDecPricePerDay] = useState("");
    const [decImage, setDecImage] = useState(null);
    const [decImagePreview, setDecImagePreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const API_BASE_URL = "https://event-management-szqn.onrender.com";

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`/fetchDecerationById/${serviceId}`);
                const data = response.data.data;
                if (data) {
                    setCompanyName(data.companyName || "");
                    setAddress(data.address || "");
                    setLocation(data.location || "");
                    setPhone(data.phone || "");
                    setDescription(data.description || "");
                    // Mapping existing packages with image paths properly
                    setDecorations(data.decorations || []);
                }
            } catch (error) {
                console.error(error);
                alert("Failed to load service");
            } finally {
                setFetching(false);
            }
        };
        fetchService();
    }, [serviceId]);

    const handleDecorationImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setDecImage(file);
        setDecImagePreview(URL.createObjectURL(file));
    };

    const addDecoration = () => {
        if (!decTitle || !decDescription || !decPricePerDay || (!decImage && !decImagePreview)) {
            alert("Fill all package fields!");
            return;
        }
        setDecorations((prev) => [
            ...prev,
            {
                id: Date.now(),
                title: decTitle,
                description: decDescription,
                category: decCategory,
                pricePerDay: Number(decPricePerDay),
                image: decImage, // null if editing existing and didn't change
                preview: decImagePreview,
            },
        ]);
        setDecTitle("");
        setDecDescription("");
        setDecCategory("Affordable");
        setDecPricePerDay("");
        setDecImage(null);
        setDecImagePreview(null);
    };

    const removeDecoration = (index) => setDecorations(decorations.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("companyName", companyName);
            formData.append("address", address);
            formData.append("location", location);
            formData.append("phone", phone);
            formData.append("description", description);
            formData.append("category", "stage-decoration");

            const packagesData = decorations.map((item) => {
                if (item.image) {
                    formData.append("images", item.image);
                } else if (item.imagePath) {
                    // We need a way to tell the backend which existing images to keep or use
                    // For now, let's assume we send the imagePath in the package data
                }
                return {
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    pricePerDay: item.pricePerDay,
                    imagePath: item.imagePath // If it was existing
                };
            });

            formData.append("packages", JSON.stringify(packagesData));

            await axios.put(`/editDeceration/${serviceId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Stage Decoration Updated!");
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
        <div className="p-6 w-full">
            <h2 className="text-3xl font-bold mb-6 text-gray-600">Update Stage Decoration</h2>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl grid md:grid-cols-2 gap-6">
                <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="border p-3 rounded-xl" required />
                <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="border p-3 rounded-xl" required />
                <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-3 rounded-xl" required />
                <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-3 rounded-xl" required />
                <textarea rows={4} placeholder="About service" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-3 rounded-xl md:col-span-2" required />

                <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4 text-gray-600">Edit Packages</h3>
                    <div className="grid md:grid-cols-5 gap-4">
                        <input placeholder="Title" value={decTitle} onChange={(e) => setDecTitle(e.target.value)} className="border p-3 rounded-xl" />
                        <input placeholder="Desc" value={decDescription} onChange={(e) => setDecDescription(e.target.value)} className="border p-3 rounded-xl" />
                        <select value={decCategory} onChange={(e) => setDecCategory(e.target.value)} className="border p-3 rounded-xl">
                            <option>Affordable</option><option>Premium</option><option>Luxury</option>
                        </select>
                        <input type="number" placeholder="Price" value={decPricePerDay} onChange={(e) => setDecPricePerDay(e.target.value)} className="border p-3 rounded-xl" />
                        <input type="file" accept="image/*" onChange={handleDecorationImage} className="border p-3 rounded-xl bg-gray-50" />
                    </div>
                    {decImagePreview && (
                        <div className="relative w-fit mt-3">
                            <img src={decImagePreview.startsWith("blob") ? decImagePreview : `${API_BASE_URL}/${decImagePreview.replace(/\\/g, "/").replace("public/", "")}`} alt="preview" className="h-20 w-20 object-cover rounded-lg border" />
                            <button type="button" onClick={() => { setDecImage(null); setDecImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">✕</button>
                        </div>
                    )}
                    <button type="button" onClick={addDecoration} className="mt-4 bg-cyan-700 text-white px-6 py-2 rounded-xl">+ Add Package</button>
                </div>

                <div className="md:col-span-2">
                    {decorations.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-xl mb-2">
                            <div className="flex items-center gap-3">
                                <img src={item.preview || (item.imagePath ? `${API_BASE_URL}/${item.imagePath.replace(/\\/g, "/").replace("public/", "")}` : "/placeholder.jpg")} alt="p" className="h-12 w-12 object-cover rounded-lg border" />
                                <span>{item.title} | {item.category} | ₹{item.pricePerDay}/day</span>
                            </div>
                            <button type="button" onClick={() => removeDecoration(index)} className="text-red-600">Remove</button>
                        </div>
                    ))}
                </div>

                <button type="submit" className="md:col-span-2 mt-6 bg-cyan-800 text-white py-3 rounded-xl text-lg font-semibold">
                    {loading ? "Updating..." : "Update Stage Decoration Service"}
                </button>
            </form>
        </div>
    );
};

export default EditStageDecoration;
