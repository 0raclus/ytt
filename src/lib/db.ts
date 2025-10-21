import { neon } from '@neondatabase/serverless';

// Neon PostgreSQL connection
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || 
  'postgresql://neondb_owner:npg_DvAa7CF2IGpu@ep-hidden-breeze-agkweyze-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

export const sql = neon(DATABASE_URL);

// Database helper functions
export const db = {
  // Events
  async getEvents() {
    return await sql`
      SELECT * FROM events 
      ORDER BY date ASC
    `;
  },

  async getEvent(id: string) {
    const result = await sql`
      SELECT * FROM events 
      WHERE id = ${id}
    `;
    return result[0];
  },

  async createEvent(event: any) {
    const result = await sql`
      INSERT INTO events (
        title, description, date, location, 
        max_participants, current_participants, 
        image_url, category, status
      )
      VALUES (
        ${event.title}, ${event.description}, ${event.date}, ${event.location},
        ${event.max_participants}, ${event.current_participants || 0},
        ${event.image_url}, ${event.category}, ${event.status || 'upcoming'}
      )
      RETURNING *
    `;
    return result[0];
  },

  async updateEvent(id: string, event: any) {
    const result = await sql`
      UPDATE events 
      SET 
        title = ${event.title},
        description = ${event.description},
        date = ${event.date},
        location = ${event.location},
        max_participants = ${event.max_participants},
        image_url = ${event.image_url},
        category = ${event.category},
        status = ${event.status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  async deleteEvent(id: string) {
    await sql`DELETE FROM events WHERE id = ${id}`;
  },

  // Event Registrations
  async getEventRegistrations(eventId: string) {
    return await sql`
      SELECT 
        er.*,
        up.full_name,
        up.email,
        up.phone
      FROM event_registrations er
      JOIN user_profiles up ON er.user_id = up.user_id
      WHERE er.event_id = ${eventId}
      ORDER BY er.registered_at DESC
    `;
  },

  async registerForEvent(userId: string, eventId: string) {
    const result = await sql`
      INSERT INTO event_registrations (user_id, event_id, status)
      VALUES (${userId}, ${eventId}, 'registered')
      RETURNING *
    `;
    
    // Update event participant count
    await sql`
      UPDATE events 
      SET current_participants = current_participants + 1
      WHERE id = ${eventId}
    `;
    
    return result[0];
  },

  async unregisterFromEvent(userId: string, eventId: string) {
    await sql`
      DELETE FROM event_registrations 
      WHERE user_id = ${userId} AND event_id = ${eventId}
    `;
    
    await sql`
      UPDATE events 
      SET current_participants = GREATEST(current_participants - 1, 0)
      WHERE id = ${eventId}
    `;
  },

  // Plants
  async getPlants() {
    return await sql`
      SELECT * FROM plants 
      ORDER BY name ASC
    `;
  },

  async getPlant(id: string) {
    const result = await sql`
      SELECT * FROM plants 
      WHERE id = ${id}
    `;
    return result[0];
  },

  async createPlant(plant: any) {
    const result = await sql`
      INSERT INTO plants (
        name, scientific_name, description, care_instructions,
        watering_frequency, sunlight_requirement, difficulty_level,
        image_url, category
      )
      VALUES (
        ${plant.name}, ${plant.scientific_name}, ${plant.description},
        ${plant.care_instructions}, ${plant.watering_frequency},
        ${plant.sunlight_requirement}, ${plant.difficulty_level},
        ${plant.image_url}, ${plant.category}
      )
      RETURNING *
    `;
    return result[0];
  },

  async updatePlant(id: string, plant: any) {
    const result = await sql`
      UPDATE plants 
      SET 
        name = ${plant.name},
        scientific_name = ${plant.scientific_name},
        description = ${plant.description},
        care_instructions = ${plant.care_instructions},
        watering_frequency = ${plant.watering_frequency},
        sunlight_requirement = ${plant.sunlight_requirement},
        difficulty_level = ${plant.difficulty_level},
        image_url = ${plant.image_url},
        category = ${plant.category},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  async deletePlant(id: string) {
    await sql`DELETE FROM plants WHERE id = ${id}`;
  },

  // Blog Posts
  async getBlogPosts(limit?: number) {
    if (limit) {
      return await sql`
        SELECT * FROM blog_posts 
        WHERE status = 'published'
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
    }
    return await sql`
      SELECT * FROM blog_posts 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
  },

  async getBlogPost(id: string) {
    const result = await sql`
      SELECT * FROM blog_posts 
      WHERE id = ${id}
    `;
    return result[0];
  },

  async createBlogPost(post: any) {
    const result = await sql`
      INSERT INTO blog_posts (
        title, content, excerpt, author_id, 
        featured_image, category, tags, status
      )
      VALUES (
        ${post.title}, ${post.content}, ${post.excerpt}, ${post.author_id},
        ${post.featured_image}, ${post.category}, ${post.tags}, ${post.status || 'draft'}
      )
      RETURNING *
    `;
    return result[0];
  },

  async updateBlogPost(id: string, post: any) {
    const result = await sql`
      UPDATE blog_posts 
      SET 
        title = ${post.title},
        content = ${post.content},
        excerpt = ${post.excerpt},
        featured_image = ${post.featured_image},
        category = ${post.category},
        tags = ${post.tags},
        status = ${post.status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return result[0];
  },

  async deleteBlogPost(id: string) {
    await sql`DELETE FROM blog_posts WHERE id = ${id}`;
  },

  // Users
  async getUsers() {
    return await sql`
      SELECT 
        up.*,
        au.email as auth_email
      FROM user_profiles up
      LEFT JOIN auth.users au ON up.user_id = au.id
      ORDER BY up.created_at DESC
    `;
  },

  async getUser(userId: string) {
    const result = await sql`
      SELECT * FROM user_profiles 
      WHERE user_id = ${userId}
    `;
    return result[0];
  },

  async getUserByEmail(email: string) {
    const result = await sql`
      SELECT * FROM user_profiles 
      WHERE email = ${email}
    `;
    return result[0];
  },

  async createUser(user: any) {
    const result = await sql`
      INSERT INTO user_profiles (
        user_id, email, full_name, phone, role
      )
      VALUES (
        ${user.user_id}, ${user.email}, ${user.full_name}, 
        ${user.phone || null}, ${user.role || 'user'}
      )
      RETURNING *
    `;
    return result[0];
  },

  async updateUser(userId: string, user: any) {
    const result = await sql`
      UPDATE user_profiles 
      SET 
        full_name = ${user.full_name},
        phone = ${user.phone},
        bio = ${user.bio},
        avatar_url = ${user.avatar_url},
        updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `;
    return result[0];
  },

  // Notifications
  async getNotifications(userId: string) {
    return await sql`
      SELECT * FROM notifications 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
  },

  async createNotification(notification: any) {
    const result = await sql`
      INSERT INTO notifications (
        user_id, title, message, type, read
      )
      VALUES (
        ${notification.user_id}, ${notification.title}, 
        ${notification.message}, ${notification.type}, false
      )
      RETURNING *
    `;
    return result[0];
  },

  async markNotificationAsRead(id: string) {
    await sql`
      UPDATE notifications 
      SET read = true 
      WHERE id = ${id}
    `;
  },
};

