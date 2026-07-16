-- =========================================================================
-- COMPLETE MASTER DATABASE CONFIGURATION FOR SUPABASE (POSTGRESQL)
-- Project: Solusi Mr Bi - Konseling Pernikahan & Dinamika Cinta
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. UTILITY FUNCTIONS & TRIGGER PROCEDURES
-- =========================================================================

-- Automatically update updated_at timestamp on record changes
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if a specific user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles p
        JOIN public.roles r ON p.role_id = r.id
        WHERE p.id = user_id AND r.name = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if a user has purchased a specific premium item (video, ebook, etc.)
CREATE OR REPLACE FUNCTION public.has_purchased_item(user_id UUID, target_type VARCHAR, target_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.transactions t
        WHERE t.client_id = user_id 
          AND t.item_type = target_type 
          AND t.item_id = target_id 
          AND t.status = 'completed'
          AND t.deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if a user has access to a specific storage ebook filename
CREATE OR REPLACE FUNCTION public.can_access_ebook(user_id UUID, filename TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    ebook_id UUID;
BEGIN
    -- Match storage filename to ebooks table via download_url or slug
    SELECT id INTO ebook_id 
    FROM public.premium_ebooks 
    WHERE download_url LIKE '%' || filename || '%' OR slug = split_part(filename, '.', 1)
    LIMIT 1;

    IF ebook_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Admins have automatic access, regular users need a completed purchase
    RETURN public.is_admin(user_id) OR public.has_purchased_item(user_id, 'ebook', ebook_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================================================
-- 2. SCHEMAS & TABLE CONSTRAINTS
-- =========================================================================

-- A. roles
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY, -- Maps directly to auth.users.id
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL, -- Slug
    description TEXT,
    meta_title VARCHAR(255), -- SEO Field
    meta_description TEXT, -- SEO Field
    meta_keywords TEXT, -- SEO Field
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. tags
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL, -- Slug
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- E. articles
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Slug
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    read_time VARCHAR(50) NOT NULL,
    cover_url TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')) NOT NULL, -- Status
    meta_title VARCHAR(255), -- SEO Field
    meta_description TEXT, -- SEO Field
    meta_keywords TEXT, -- SEO Field
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- F. article_tags (Many-to-Many Bridge Table)
CREATE TABLE public.article_tags (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- G. premium_videos
CREATE TABLE public.premium_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Slug
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    thumbnail_url TEXT,
    video_url TEXT NOT NULL,
    price NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (price >= 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')) NOT NULL, -- Status
    meta_title VARCHAR(255), -- SEO Field
    meta_description TEXT, -- SEO Field
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- H. premium_ebooks
CREATE TABLE public.premium_ebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Slug
    author VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT,
    download_url TEXT,
    price NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (price >= 0),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')) NOT NULL, -- Status
    meta_title VARCHAR(255), -- SEO Field
    meta_description TEXT, -- SEO Field
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- I. bookings
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) NOT NULL, -- Status
    payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'failed', 'refunded')) NOT NULL, -- Status
    payment_url TEXT,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- J. forum_topics
CREATE TABLE public.forum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Slug
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    likes INTEGER DEFAULT 0 NOT NULL CHECK (likes >= 0),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pinned')) NOT NULL, -- Status
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- K. forum_comments
CREATE TABLE public.forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- L. payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) DEFAULT 'IDR' NOT NULL,
    gateway VARCHAR(50) DEFAULT 'midtrans' NOT NULL,
    external_reference VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired', 'refunded')) NOT NULL, -- Status
    payment_method VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- M. transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    item_type VARCHAR(100) NOT NULL CHECK (item_type IN ('booking', 'video', 'ebook', 'membership')),
    item_id UUID NOT NULL, -- Polymorphic reference to target video, ebook, booking or membership ID
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'refunded')) NOT NULL, -- Status
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- N. memberships
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tier VARCHAR(50) DEFAULT 'free' CHECK (tier IN ('free', 'premium', 'vip')) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')) NOT NULL, -- Status
    expires_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- O. notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- P. activity_logs
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Q. testimonials
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    role_or_title VARCHAR(150),
    avatar_url TEXT,
    quote TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL, -- Status
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- R. faq
CREATE TABLE public.faq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published')) NOT NULL, -- Status
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- S. settings
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- T. newsletter
CREATE TABLE public.newsletter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')) NOT NULL, -- Status
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft Delete
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =========================================================================
-- 3. AUTO-UPDATE TIMESTAMP TRIGGERS
-- =========================================================================
CREATE TRIGGER tr_roles_update_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_profiles_update_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_categories_update_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_tags_update_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_articles_update_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_premium_videos_update_at BEFORE UPDATE ON public.premium_videos FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_premium_ebooks_update_at BEFORE UPDATE ON public.premium_ebooks FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_bookings_update_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_forum_topics_update_at BEFORE UPDATE ON public.forum_topics FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_forum_comments_update_at BEFORE UPDATE ON public.forum_comments FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_payments_update_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_transactions_update_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_memberships_update_at BEFORE UPDATE ON public.memberships FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_notifications_update_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_testimonials_update_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_faq_update_at BEFORE UPDATE ON public.faq FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_settings_update_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER tr_newsletter_update_at BEFORE UPDATE ON public.newsletter FOR EACH ROW EXECUTE FUNCTION update_modified_column();


-- =========================================================================
-- 4. PERFORMANCE & LOGICAL INDEXES
-- =========================================================================
-- Profiles Indexing
CREATE INDEX idx_profiles_role_status ON public.profiles(role_id, status);
CREATE INDEX idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NULL;

-- Categories & Tags Indexing (Fast Slug lookup & Filtering)
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_deleted_at ON public.categories(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_tags_slug ON public.tags(slug);
CREATE INDEX idx_tags_deleted_at ON public.tags(deleted_at) WHERE deleted_at IS NULL;

-- Articles Indexing (Fast queries for specific status and category joins)
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_status_published ON public.articles(status, published_at);
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_deleted_at ON public.articles(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_article_tags_tag ON public.article_tags(tag_id);

-- Premium Content Indexing
CREATE INDEX idx_videos_slug ON public.premium_videos(slug);
CREATE INDEX idx_videos_status ON public.premium_videos(status);
CREATE INDEX idx_videos_deleted_at ON public.premium_videos(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_ebooks_slug ON public.premium_ebooks(slug);
CREATE INDEX idx_ebooks_status ON public.premium_ebooks(status);
CREATE INDEX idx_ebooks_deleted_at ON public.premium_ebooks(deleted_at) WHERE deleted_at IS NULL;

-- Bookings Indexing (Schedule lookups)
CREATE INDEX idx_bookings_client ON public.bookings(client_id);
CREATE INDEX idx_bookings_date_slot ON public.bookings(date, time_slot);
CREATE INDEX idx_bookings_status_payment ON public.bookings(status, payment_status);
CREATE INDEX idx_bookings_deleted_at ON public.bookings(deleted_at) WHERE deleted_at IS NULL;

-- Forum Indexing
CREATE INDEX idx_forum_topics_slug ON public.forum_topics(slug);
CREATE INDEX idx_forum_topics_author_cat ON public.forum_topics(author_id, category_id);
CREATE INDEX idx_forum_topics_status ON public.forum_topics(status);
CREATE INDEX idx_forum_topics_deleted_at ON public.forum_topics(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_forum_comments_topic ON public.forum_comments(topic_id);
CREATE INDEX idx_forum_comments_deleted_at ON public.forum_comments(deleted_at) WHERE deleted_at IS NULL;

-- Payments & Financial Traceability
CREATE INDEX idx_payments_client_booking ON public.payments(client_id, booking_id);
CREATE INDEX idx_payments_ext_ref ON public.payments(external_reference);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_deleted_at ON public.payments(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_transactions_payment_client ON public.transactions(payment_id, client_id);
CREATE INDEX idx_transactions_polymorphic ON public.transactions(item_type, item_id);
CREATE INDEX idx_transactions_deleted_at ON public.transactions(deleted_at) WHERE deleted_at IS NULL;

-- Memberships Traceability
CREATE INDEX idx_memberships_client ON public.memberships(client_id);
CREATE INDEX idx_memberships_status_tier ON public.memberships(status, tier);
CREATE INDEX idx_memberships_deleted_at ON public.memberships(deleted_at) WHERE deleted_at IS NULL;

-- Notifications Lookups
CREATE INDEX idx_notifications_profile_read ON public.notifications(profile_id, is_read);
CREATE INDEX idx_notifications_deleted_at ON public.notifications(deleted_at) WHERE deleted_at IS NULL;

-- Log Analytics
CREATE INDEX idx_activity_logs_profile_action ON public.activity_logs(profile_id, action);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Testimonials & FAQs Search optimization
CREATE INDEX idx_testimonials_status ON public.testimonials(status);
CREATE INDEX idx_testimonials_deleted_at ON public.testimonials(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_faq_status_order ON public.faq(status, display_order);
CREATE INDEX idx_faq_deleted_at ON public.faq(deleted_at) WHERE deleted_at IS NULL;

-- Newsletter status
CREATE INDEX idx_newsletter_status ON public.newsletter(status);
CREATE INDEX idx_newsletter_deleted_at ON public.newsletter(deleted_at) WHERE deleted_at IS NULL;


-- =========================================================================
-- 5. SECURE DATABASE VIEWS (EXCLUDING SOFT-DELETED RECORDS)
-- =========================================================================
CREATE OR REPLACE VIEW public.active_profiles AS SELECT * FROM public.profiles WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_categories AS SELECT * FROM public.categories WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_tags AS SELECT * FROM public.tags WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_articles AS SELECT * FROM public.articles WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_premium_videos AS SELECT * FROM public.premium_videos WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_premium_ebooks AS SELECT * FROM public.premium_ebooks WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_bookings AS SELECT * FROM public.bookings WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_forum_topics AS SELECT * FROM public.forum_topics WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_forum_comments AS SELECT * FROM public.forum_comments WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_payments AS SELECT * FROM public.payments WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_transactions AS SELECT * FROM public.transactions WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_memberships AS SELECT * FROM public.memberships WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_notifications AS SELECT * FROM public.notifications WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_testimonials AS SELECT * FROM public.testimonials WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_faq AS SELECT * FROM public.faq WHERE deleted_at IS NULL;
CREATE OR REPLACE VIEW public.active_newsletter AS SELECT * FROM public.newsletter WHERE deleted_at IS NULL;


-- =========================================================================
-- 6. AUTOMATED SUPABASE AUTH SYNCHRONIZATION
-- =========================================================================

-- Trigger function executed automatically when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
BEGIN
    -- Retrieve the standard 'client' role ID
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'client' LIMIT 1;
    
    INSERT INTO public.profiles (id, email, full_name, role_id, avatar_url, status)
    VALUES (
        NEW.id,
        NEW.email,
        coalesce(
            NEW.raw_user_meta_data->>'full_name', 
            NEW.raw_user_meta_data->>'fullName', 
            split_part(NEW.email, '@', 1)
        ),
        default_role_id,
        NEW.raw_user_meta_data->>'avatar_url',
        'active'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger function to Supabase's internal auth.users table
-- This statement can be safely executed inside your Supabase SQL editor:
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =========================================================================
-- 7. SUPABASE STORAGE BUCKETS INITIALIZATION
-- =========================================================================
-- Automatically sets up buckets if the Supabase Storage schema is available
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_namespace WHERE nspname = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES 
        ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']),
        ('covers', 'covers', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']),
        ('ebooks', 'ebooks', false, 52428800, ARRAY['application/pdf', 'application/epub+zip'])
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;


-- =========================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS across all tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Dynamic administrative policies setup
CREATE POLICY "Admin full access roles" ON public.roles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access tags" ON public.tags FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access articles" ON public.articles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access premium_videos" ON public.premium_videos FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access premium_ebooks" ON public.premium_ebooks FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access bookings" ON public.bookings FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access forum_topics" ON public.forum_topics FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access forum_comments" ON public.forum_comments FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access payments" ON public.payments FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access transactions" ON public.transactions FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access memberships" ON public.memberships FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access notifications" ON public.notifications FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access faq" ON public.faq FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access settings" ON public.settings FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admin full access newsletter" ON public.newsletter FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Roles policies
CREATE POLICY "Allow select access to active roles" ON public.roles FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Allow public read active profiles" ON public.profiles FOR SELECT USING (status = 'active' AND deleted_at IS NULL);
CREATE POLICY "Allow users to edit their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories & Tags policies
CREATE POLICY "Allow anonymous read categories" ON public.categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Allow anonymous read tags" ON public.tags FOR SELECT USING (deleted_at IS NULL);

-- Articles policies
CREATE POLICY "Allow anonymous read published articles" ON public.articles FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Bookings policies
CREATE POLICY "Users can select own bookings" ON public.bookings FOR SELECT USING (auth.uid() = client_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own pending bookings" ON public.bookings FOR UPDATE USING (auth.uid() = client_id AND status = 'pending' AND deleted_at IS NULL);

-- Forum Topics policies
CREATE POLICY "Allow anonymous read topics" ON public.forum_topics FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can insert own topics" ON public.forum_topics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own topics" ON public.forum_topics FOR UPDATE USING (auth.uid() = author_id AND deleted_at IS NULL);

-- Forum Comments policies
CREATE POLICY "Allow anonymous read comments" ON public.forum_comments FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can insert own comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own comments" ON public.forum_comments FOR UPDATE USING (auth.uid() = author_id AND deleted_at IS NULL);

-- Financial & Transactions policies
CREATE POLICY "Users can select own payments" ON public.payments FOR SELECT USING (auth.uid() = client_id AND deleted_at IS NULL);
CREATE POLICY "Users can select own transactions" ON public.transactions FOR SELECT USING (auth.uid() = client_id AND deleted_at IS NULL);

-- Memberships policies
CREATE POLICY "Users can select own memberships" ON public.memberships FOR SELECT USING (auth.uid() = client_id AND deleted_at IS NULL);

-- Notifications policies
CREATE POLICY "Users can select own notifications" ON public.notifications FOR SELECT USING (auth.uid() = profile_id AND deleted_at IS NULL);
CREATE POLICY "Users can update read status on own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = profile_id AND deleted_at IS NULL);

-- Activity Logs (System only / Self logging)
CREATE POLICY "Allow system insert logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);

-- Testimonials & FAQ policies
CREATE POLICY "Allow public read approved testimonials" ON public.testimonials FOR SELECT USING (status = 'approved' AND deleted_at IS NULL);
CREATE POLICY "Allow public read published FAQs" ON public.faq FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

-- Newsletter policies
CREATE POLICY "Allow anonymous newsletter insert" ON public.newsletter FOR INSERT WITH CHECK (status = 'subscribed' AND deleted_at IS NULL);


-- =========================================================================
-- 9. STORAGE BUCKET RLS POLICIES (STORAGE.OBJECTS)
-- =========================================================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_namespace WHERE nspname = 'storage') THEN
        -- Enable RLS on storage.objects
        ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

        -- Avatars bucket policies
        CREATE POLICY "Allow public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
        CREATE POLICY "Allow auth users upload avatars" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (auth.uid())::text = owner);
        CREATE POLICY "Allow auth users update avatars" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (auth.uid())::text = owner);
        CREATE POLICY "Allow auth users delete avatars" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND (auth.uid())::text = owner);

        -- Covers bucket policies
        CREATE POLICY "Allow public read covers" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
        CREATE POLICY "Allow admins upload covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers' AND public.is_admin(auth.uid()));
        CREATE POLICY "Allow admins update covers" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'covers' AND public.is_admin(auth.uid()));
        CREATE POLICY "Allow admins delete covers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'covers' AND public.is_admin(auth.uid()));

        -- Private Ebooks bucket policies (valid transactions lookup)
        CREATE POLICY "Allow read purchased ebooks" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'ebooks' AND public.can_access_ebook(auth.uid(), name));
    END IF;
END $$;


-- =========================================================================
-- 10. REAL-TIME SUBSCRIPTION PUBLICATIONS
-- =========================================================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Safely integrate critical tables into Supabase Realtime publication
        ALTER PUBLICATION supabase_realtime ADD TABLE 
            public.bookings, 
            public.forum_topics, 
            public.forum_comments, 
            public.notifications;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Silently fallback if realtime publication table locking is handled elsewhere
END $$;


-- =========================================================================
-- 11. CUSTOM RPC (REMOTE PROCEDURE CALL) OPERATIONS
-- =========================================================================

-- RPC 1: Safely join or renew newsletter subscription
CREATE OR REPLACE FUNCTION public.join_newsletter(email_address TEXT)
RETURNS JSONB AS $$
DECLARE
    new_id UUID;
    ret_status TEXT;
BEGIN
    INSERT INTO public.newsletter (email, status)
    VALUES (email_address, 'subscribed')
    ON CONFLICT (email) DO UPDATE 
    SET status = 'subscribed', updated_at = timezone('utc'::text, now())
    RETURNING id, status INTO new_id, ret_status;

    RETURN jsonb_build_object(
        'success', true,
        'id', new_id,
        'status', ret_status,
        'message', 'Successfully subscribed to the newsletter'
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
        'success', false,
        'message', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 2: Fetch already booked slots for calendar disabling
CREATE OR REPLACE FUNCTION public.get_booked_slots(selected_date DATE)
RETURNS TABLE (time_slot VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT b.time_slot 
    FROM public.bookings b
    WHERE b.date = selected_date 
      AND b.status IN ('pending', 'confirmed', 'completed')
      AND b.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 3: Admin portal aggregate metrics
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_summary()
RETURNS JSONB AS $$
DECLARE
    total_bookings INT;
    pending_bookings INT;
    total_earnings NUMERIC(12,2);
    active_clients INT;
    forum_topics_count INT;
    subscribers_count INT;
BEGIN
    SELECT COUNT(*) INTO total_bookings FROM public.bookings WHERE deleted_at IS NULL;
    SELECT COUNT(*) INTO pending_bookings FROM public.bookings WHERE status = 'pending' AND deleted_at IS NULL;
    SELECT COALESCE(SUM(amount), 0) INTO total_earnings FROM public.payments WHERE status = 'success' AND deleted_at IS NULL;
    SELECT COUNT(DISTINCT client_id) INTO active_clients FROM public.bookings WHERE deleted_at IS NULL;
    SELECT COUNT(*) INTO forum_topics_count FROM public.forum_topics WHERE deleted_at IS NULL;
    SELECT COUNT(*) INTO subscribers_count FROM public.newsletter WHERE status = 'subscribed' AND deleted_at IS NULL;

    RETURN jsonb_build_object(
        'total_bookings', total_bookings,
        'pending_bookings', pending_bookings,
        'total_earnings', total_earnings,
        'active_clients', active_clients,
        'forum_topics_count', forum_topics_count,
        'subscribers_count', subscribers_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 4: Client portal holistic dashboard statistics
CREATE OR REPLACE FUNCTION public.get_client_portal_dashboard(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    upcoming_booking JSONB;
    unread_notifications_count INT;
    purchased_videos JSONB;
    purchased_ebooks JSONB;
    active_membership_tier TEXT;
BEGIN
    -- Query next active booking
    SELECT json_build_object(
        'id', b.id,
        'date', b.date,
        'time_slot', b.time_slot,
        'status', b.status,
        'category_name', c.name
    )::jsonb INTO upcoming_booking
    FROM public.bookings b
    LEFT JOIN public.categories c ON b.category_id = c.id
    WHERE b.client_id = user_uuid 
      AND b.date >= CURRENT_DATE 
      AND b.status IN ('pending', 'confirmed')
      AND b.deleted_at IS NULL
    ORDER BY b.date ASC, b.time_slot ASC
    LIMIT 1;

    -- Unread notifications state
    SELECT COUNT(*) INTO unread_notifications_count 
    FROM public.notifications 
    WHERE profile_id = user_uuid AND is_read = FALSE AND deleted_at IS NULL;

    -- Purchased premium streaming videos
    SELECT COALESCE(json_agg(json_build_object('id', pv.id, 'title', pv.title)), '[]')::jsonb INTO purchased_videos
    FROM public.transactions t
    JOIN public.premium_videos pv ON t.item_id = pv.id
    WHERE t.client_id = user_uuid AND t.item_type = 'video' AND t.status = 'completed' AND t.deleted_at IS NULL;

    -- Purchased premium ebooks
    SELECT COALESCE(json_agg(json_build_object('id', pe.id, 'title', pe.title)), '[]')::jsonb INTO purchased_ebooks
    FROM public.transactions t
    JOIN public.premium_ebooks pe ON t.item_id = pe.id
    WHERE t.client_id = user_uuid AND t.item_type = 'ebook' AND t.status = 'completed' AND t.deleted_at IS NULL;

    -- Current membership validation
    SELECT tier INTO active_membership_tier
    FROM public.memberships
    WHERE client_id = user_uuid AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW()) AND deleted_at IS NULL
    LIMIT 1;

    RETURN jsonb_build_object(
        'upcoming_booking', upcoming_booking,
        'unread_notifications', unread_notifications_count,
        'purchased_videos', purchased_videos,
        'purchased_ebooks', purchased_ebooks,
        'membership_tier', COALESCE(active_membership_tier, 'free')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- =========================================================================
-- 12. SEED SECTIONS / BOOTSTRAPPING
-- =========================================================================

-- Roles Seed
INSERT INTO public.roles (id, name, description) VALUES
('00000000-0000-0000-0000-000000000001', 'admin', 'Administrator with full system privileges'),
('00000000-0000-0000-0000-000000000002', 'client', 'Default client role for consulting consumers')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- Categories Seed
INSERT INTO public.categories (id, name, slug, description, meta_title, meta_description, meta_keywords) VALUES
('c0000000-0000-0000-0000-000000000001', 'Pernikahan', 'pernikahan', 'Pendampingan khusus pasangan suami istri untuk menyelaraskan harapan dan memulihkan komitmen.', 'Konseling Pernikahan Terbaik - Solusi Mr Bi', 'Konseling khusus pasangan suami istri untuk menyelaraskan harapan dan memulihkan batin.', 'konseling pernikahan, rumah tangga bahagia, terapi pasutri'),
('c0000000-0000-0000-0000-000000000002', 'Pasangan', 'pasangan', 'Resolusi konflik pacaran atau tunangan untuk mengenali pola komunikasi disfungsional.', 'Konseling Pasangan - Solusi Mr Bi', 'Solusi resolusi konflik pacaran, tunangan, dan hubungan asmara terarah.', 'konseling pacaran, resolusi konflik, komunikasi pasangan'),
('c0000000-0000-0000-0000-000000000003', 'Pranikah', 'pranikah', 'Bimbingan kesiapan psikologis, finansial, dan visi misi keluarga baru sebelum melangkah ke pernikahan.', 'Bimbingan Pranikah Holistik - Solusi Mr Bi', 'Persiapan bimbingan kesiapan mental, psikologis dan finansial sebelum pernikahan.', 'bimbingan pranikah, persiapan nikah, kesiapan mental'),
('c0000000-0000-0000-0000-000000000004', 'Dinamika Cinta', 'dinamika-cinta', 'Artikel dan materi edukasi mengenai pernak-pernik asmara dan relasi interpersonal.', 'Artikel Dinamika Cinta - Solusi Mr Bi', 'Tips dan kajian psikologis tentang interaksi asmara serta keintiman cinta.', 'dinamika cinta, psikologi asmara, tips hubungan'),
('c0000000-0000-0000-0000-000000000005', 'Seksologi', 'seksologi', 'Materi edukasi keintiman fisik dan kesehatan seksual relasi berpasangan secara ilmiah.', 'Edukasi Seksologi Sehat - Solusi Mr Bi', 'Diskusi ilmiah dan psikologis mengenai keintiman biologis pasangan suami istri.', 'seksologi pernikahan, keintiman fisik, edukasi seksual')
ON CONFLICT (name) DO UPDATE SET slug = EXCLUDED.slug, description = EXCLUDED.description, meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description, meta_keywords = EXCLUDED.meta_keywords;

-- System Settings Seed
INSERT INTO public.settings (key, value, description, category) VALUES
('site_name', 'Solusi Mr Bi', 'Nama resmi website/platform', 'general'),
('site_description', 'Memahami makna terdalam dari pernikahan dan dinamika cinta melalui lensa psikologi.', 'Deskripsi singkat platform', 'general'),
('whatsapp_support', '+6281234567890', 'Nomor WhatsApp resmi layanan bantuan pelanggan', 'contact'),
('counseling_price_pernikahan', '350000', 'Harga standar sesi konseling pernikahan per jam', 'pricing'),
('counseling_price_pasangan', '250000', 'Harga standar sesi konseling pasangan per jam', 'pricing'),
('counseling_price_pranikah', '300000', 'Harga standar sesi konseling pranikah per jam', 'pricing')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;

-- FAQs Seed
INSERT INTO public.faq (question, answer, category, display_order, status) VALUES
('Apakah data konseling dijamin kerahasiaannya?', 'Ya, seluruh data dan isi percakapan konseling dilindungi sepenuhnya oleh kode etik psikologi dan asas kerahasiaan klien.', 'Privasi', 1, 'published'),
('Bagaimana metode pembayaran konseling di Solusi Mr Bi?', 'Kami menggunakan Midtrans Payment Gateway yang mendukung transfer bank, kartu kredit, QRIS, e-wallet, dan outlet ritel resmi.', 'Pembayaran', 2, 'published'),
('Apakah jadwal sesi konseling dapat direschedule?', 'Reschedule dapat dilakukan selambat-lambatnya 24 jam sebelum jadwal sesi dimulai dengan menghubungi layanan WhatsApp Customer Support kami.', 'Layanan', 3, 'published')
ON CONFLICT (question) DO NOTHING;
