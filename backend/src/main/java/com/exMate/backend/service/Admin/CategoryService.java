package com.exMate.backend.service.Admin;

import com.exMate.backend.model.Category;
import com.exMate.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category addCategory(Category category) {
        if (categoryRepository.findByName(category.getName()) != null) {
            throw new RuntimeException("Error: Category name is already in use!");
        }
        return categoryRepository.save(category);
    }

    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category updateCategory(Long categoryId, Category category) {
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existingCategory.setName(category.getName());
        return categoryRepository.save(existingCategory);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public void deleteCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(categoryId);
    }
}
