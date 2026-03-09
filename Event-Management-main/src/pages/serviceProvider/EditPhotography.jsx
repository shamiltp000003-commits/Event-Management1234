import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPhotography = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [studioName, setStudioName] = useState("");
  const [photographerName, setPhotographerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packageName, setPackageName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [packagePricePerHour, setPackagePricePerHour] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const API_BASE_URL = "https://event-management-szqn.onrender.com";

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`/fetchPhotographyById/${serviceId}`);
        const data = response.data.data;
        if (data) {
          setStudioName(data.studioName || "");
          setPhotographerName(data.photographerName || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setServiceTypes(data.serviceTypes || []);
          setPackages(data.packages || []);
          setExistingImages(data.images || []);
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

  const toggleServiceType = (type) => {
    setServiceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const addPackage = () => {
    if (!packageName || !packagePricePerHour) {
      alert("Fill fields");
      return;
    }
    setPackages([...packages, { id: Date.now(), name: packageName, description: packageDescription, pricePerHour: Number(packagePricePerHour) }]);
    setPackageName(""); setPackageDescription(""); setPackagePricePerHour("");
  };

  const removePackage = (id) => setPackages(packages.filter((p) => p.id !== id));

  const handlePortfolioUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length + existingImages.length > 4) {
      alert("Max 4 images"); return;
    }
    setImages([...images, ...files.map(file => ({ file, preview: URL.createObjectURL(file) }))]);
  };

  const removeNewImage = (index) => setImages(images.filter((_, i) => i !== index));
  const removeExistingImage = (index) => setExistingImages(existingImages.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("studioName", studioName);
      formData.append("photographerName", photographerName);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("serviceTypes", JSON.stringify(serviceTypes));
      formData.append("packages", JSON.stringify(packages));
      formData.append("category", "photography");
      formData.append("remainingImages", JSON.stringify(existingImages));

      images.forEach(img => formData.append("images", img.file));

      await axios.put(`/editPhotography/${serviceId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      alert("Photography Service Updated");
      navigate("/provider/my-services");
    } catch (error) {
      console.error(error); alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-medium mb-6 text-gray-600">Update Photography Service</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <input className="border p-3 rounded-xl" placeholder="Studio Name" value={studioName} onChange={(e) => setStudioName(e.target.value)} required />
        <input className="border p-3 rounded-xl" placeholder="Photographer Name" value={photographerName} onChange={(e) => setPhotographerName(e.target.value)} required />
        <input className="border p-3 rounded-xl" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input className="border p-3 rounded-xl" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="border p-3 rounded-xl md:col-span-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <textarea rows={4} className="border p-3 rounded-xl md:col-span-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <div className="md:col-span-2">
          <label className="font-semibold text-gray-600 mb-2 block">Services Offered</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {["Wedding", "Engagement", "Candid", "Traditional", "Drone", "Video Coverage", "Baby Shoot", "Maternity", "Birthday", "Corporate", "Pre-Wedding"].map((type) => (
              <label key={type} className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" checked={serviceTypes.includes(type)} onChange={() => toggleServiceType(type)} />
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-3 text-gray-600">Packages</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <input className="border p-3 rounded-xl" placeholder="Pkg Name" value={packageName} onChange={(e) => setPackageName(e.target.value)} />
            <input type="number" className="border p-3 rounded-xl" placeholder="Price" value={packagePricePerHour} onChange={(e) => setPackagePricePerHour(e.target.value)} />
          </div>
          <button type="button" onClick={addPackage} className="mt-4 bg-cyan-700 text-white px-6 py-2 rounded-xl">+ Add Package</button>
          {packages.map((pkg, i) => (
            <div key={i} className="flex justify-between bg-white p-3 rounded-xl mt-2">
              <span>{pkg.name} — ₹{pkg.pricePerHour}/hr</span>
              <button type="button" onClick={() => removePackage(pkg.id || i)} className="text-red-600">Remove</button>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 text-gray-600">
          <label className="font-semibold block mb-2">Portfolio (Max 4 Total)</label>
          <input type="file" multiple accept="image/*" onChange={handlePortfolioUpload} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {existingImages.map((img, i) => (
              <div key={`ex-${i}`} className="relative">
                <img src={`${API_BASE_URL}/${img.replace(/\\/g, "/").replace("public/", "")}`} alt="e" className="h-24 w-full object-cover rounded-lg border" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">✕</button>
              </div>
            ))}
            {images.map((img, i) => (
              <div key={`nw-${i}`} className="relative border-2 border-cyan-500 rounded-lg">
                <img src={img.preview} alt="n" className="h-24 w-full object-cover rounded-lg" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">✕</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="md:col-span-2 mt-6 bg-cyan-700 text-white py-3 rounded-xl text-lg font-semibold">
          {loading ? "Updating..." : "Update Photography Service"}
        </button>
      </form>
    </div>
  );
};

export default EditPhotography;
