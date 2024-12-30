const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Category using `exports`
exports.createCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(422).json({ error: "Name is required" });
    }

    // Check if the category name already exists in the database
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: req.body.name, // Search by the 'name' field
      },
    });

    if (existingCategory) {
      return res
        .status(409)
        .json({ error: `${req.body.name} category already exists` });
    }

    // Create a new category
    const newCategory = await prisma.category.create({
      data: {
        name: req.body.name,
      },
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get Category using `exports`
exports.getCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




// Update Category using `exports`
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name } = req.body; 

    // Validate inputs
    if (!name) {
      return res.status(422).json({ error: "Name is required" });
    }

    // Find the category by id
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id), // Make sure id is an integer
      },
    });

    // If category not found, return 404
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: {
        id: parseInt(id), // Update category by the given id
      },
      data: {
        name: name,  // Update the name of the category
      },
    });

    return res.status(200).json(updatedCategory); 
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




// Delete Category using `exports`
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params; // Get category id from the URL parameter

    // Find the category by id
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id), // Ensure the id is an integer
      },
    });

    // If category not found, return 404
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete the category
    await prisma.category.delete({
      where: {
        id: parseInt(id), // Delete category by the given id
      },
    });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
