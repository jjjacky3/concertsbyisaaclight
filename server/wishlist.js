async function getWishlist(uID) {
  try {
    const query = `
      SELECT cID
      FROM Wishlist
      WHERE uID = $1
    `;
    const { rows } = await pool.query(query, [uID]);
    return rows;
  } catch (err) {
    console.error('Error fetching wishlisted concerts:', err);
    throw new Error('Failed to fetch wishlisted concerts');
  }
}

async function addToWishlist(uID, cID) {
  try {
    const query = `
      INSERT INTO Wishlist (uID, cID)
      VALUES ($1, $2)
      ON CONFLICT (uID, cID) DO NOTHING
    `;
    await pool.query(query, [uID, cID]);
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    throw new Error('Failed to add to wishlist');
  }
}

async function removeFromWishlist(uID, cID) {
  try {
    const query = `
      DELETE FROM Wishlist
      WHERE uID = $1 AND cID = $2
    `;
    await pool.query(query, [uID, cID]);
  } catch (err) {
    console.error('Error removing from wishlist:', err);
    throw new Error('Failed to remove from wishlist');
  }
}
