import {
  collection,
  doc,
  setDoc,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

// Initialize Collections with sample data
export const initializeFirestoreCollections = async () => {
  try {
    console.log("Starting Firestore initialization...");

    // 1. Initialize Categories Collection
    await initializeCategories();

    // 2. Initialize Templates Collection
    await initializeTemplates();

    // 3. Initialize Other Collections (empty, ready to receive data)
    await initializeEmptyCollections();

    console.log("✅ Firestore initialization completed successfully!");
    return { success: true, message: "Collections initialized" };
  } catch (error) {
    console.error("❌ Error initializing Firestore:", error);
    throw error;
  }
};

// Initialize Categories
const initializeCategories = async () => {
  const categoriesRef = collection(db, "categories");

  // Check if categories already exist
  const q = query(categoriesRef);
  const snapshot = await getDocs(q);

  if (snapshot.size > 0) {
    console.log("Categories already exist, skipping...");
    return;
  }

  const categories = [
    {
      id: "wedding",
      name: "Pernikahan",
      slug: "wedding",
      description: "Template untuk website pernikahan dan undangan digital",
    },
    {
      id: "portfolio",
      name: "Portofolio",
      slug: "portfolio",
      description: "Template untuk portofolio personal dan profesional",
    },
    {
      id: "birthday",
      name: "Ulang Tahun",
      slug: "birthday",
      description: "Template hadiah untuk perayaan ulang tahun",
    },
    {
      id: "anniversary",
      name: "Anniversary",
      slug: "anniversary",
      description: "Template untuk perayaan hari jadi dan anniversary",
    },
  ];

  const batch = writeBatch(db);

  for (const category of categories) {
    const docRef = doc(categoriesRef, category.id);
    batch.set(docRef, category);
  }

  await batch.commit();
  console.log("✅ Categories collection initialized");
};

// Initialize Templates
const initializeTemplates = async () => {
  const templatesRef = collection(db, "templates");

  // Check if templates already exist
  const q = query(templatesRef);
  const snapshot = await getDocs(q);

  if (snapshot.size > 0) {
    console.log("Templates already exist, skipping...");
    return;
  }

  const templates = [
    {
      id: "template-wedding-001",
      title: "Elegance Wedding Invitation",
      category: "wedding",
      description: "Website undangan pernikahan elegan dengan animasi modern",
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
      ],
      price: {
        softfile: 35000,
        url: 75000,
      },
      features: [
        "Responsive Design",
        "Countdown Timer",
        "Guest Book",
        "RSVP Form",
      ],
      rating: 4.8,
      reviewCount: 24,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "template-portfolio-001",
      title: "Modern Portfolio",
      category: "portfolio",
      description: "Template portofolio profesional untuk designer dan developer",
      images: [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
      ],
      price: {
        softfile: 35000,
        url: 75000,
      },
      features: [
        "Portfolio Gallery",
        "About Section",
        "Dark Mode",
        "Contact Form",
      ],
      rating: 4.7,
      reviewCount: 18,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "template-birthday-001",
      title: "Happy Birthday Surprise",
      category: "birthday",
      description: "Template hadiah digital untuk surprise perayaan ulang tahun",
      images: [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
      ],
      price: {
        softfile: 35000,
        url: 75000,
      },
      features: [
        "Photo Gallery",
        "Music Player",
        "Message Board",
        "Animations",
      ],
      rating: 4.9,
      reviewCount: 32,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "template-anniversary-001",
      title: "Love Anniversary",
      category: "anniversary",
      description: "Template spesial untuk perayaan hari jadi pasangan",
      images: [
        "https://images.unsplash.com/photo-1469371890661-239bcc270bed?w=400",
      ],
      price: {
        softfile: 35000,
        url: 75000,
      },
      features: [
        "Timeline Story",
        "Photo Slideshow",
        "Love Messages",
        "Responsive",
      ],
      rating: 4.6,
      reviewCount: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const batch = writeBatch(db);

  for (const template of templates) {
    const docRef = doc(templatesRef, template.id);
    batch.set(docRef, template);
  }

  await batch.commit();
  console.log("✅ Templates collection initialized");
};

// Initialize Empty Collections (structure ready)
const initializeEmptyCollections = async () => {
  const collectionsToInitialize = [
    { name: "users", docId: "__init_user__" },
    { name: "orders", docId: "__init_order__" },
    { name: "ratings", docId: "__init_rating__" },
    { name: "cart", docId: "__init_cart__" },
  ];

  for (const { name, docId } of collectionsToInitialize) {
    try {
      const docRef = doc(db, name, docId);
      
      // Create initial document with timestamp
      const initData: any = {
        _initialized: true,
        createdAt: new Date(),
      };
      
      // Add auth-friendly fields for collections with security rules
      if (name === "users") {
        initData.uid = docId;
        initData.email = "init@example.com";
      } else if (name === "orders" || name === "cart") {
        initData.userId = docId;
      } else if (name === "ratings") {
        initData.userId = docId;
      }
      
      await setDoc(docRef, initData);
      console.log(`✅ ${name} collection initialized`);
    } catch (error) {
      console.warn(
        `⚠️ Could not initialize ${name}:`,
        error instanceof Error ? error.message : error
      );
    }
  }
};

// Get all templates from Firestore
export const getTemplatesFromFirestore = async () => {
  try {
    const templatesRef = collection(db, "templates");
    const q = query(templatesRef);
    const snapshot = await getDocs(q);

    const templates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

// Add a new order to Firestore
export const addOrderToFirestore = async (userId: string, orderData: any) => {
  try {
    const ordersRef = collection(db, "orders");
    const orderRef = doc(ordersRef);

    await setDoc(orderRef, {
      ...orderData,
      userId,
      createdAt: new Date(),
      status: "pending",
    });

    return orderRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
    throw error;
  }
};

// Add a review/rating to Firestore
export const addRatingToFirestore = async (
  userId: string,
  templateId: string,
  rating: number,
  comment: string
) => {
  try {
    const ratingsRef = collection(db, "ratings");
    const ratingRef = doc(ratingsRef);

    await setDoc(ratingRef, {
      userId,
      templateId,
      rating,
      comment,
      createdAt: new Date(),
    });

    return ratingRef.id;
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
};
