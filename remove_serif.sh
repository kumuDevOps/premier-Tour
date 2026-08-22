# Remove .font-serif from CSS
sed -i 's/--font-serif: "Poppins", sans-serif;//g' src/index.css
sed -i '/\.font-serif {/ { N; N; N; d; }' src/index.css

# Replace 'font-serif' with 'font-sans' in all TSX files
find src -type f -name "*.tsx" -exec sed -i 's/font-serif/font-sans/g' {} +

echo "Removed all serif references"
