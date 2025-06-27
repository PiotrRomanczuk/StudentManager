-- Create TaskPriority enum
CREATE TYPE public."TaskPriority" AS ENUM (
    'Critical',
    'High', 
    'Medium',
    'Low'
);

-- Create TaskStatus enum
CREATE TYPE public."TaskStatus" AS ENUM (
    'Not Started',
    'In Progress',
    'Completed',
    'Blocked'
);

-- Create task_management table
CREATE TABLE public.task_management (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text NULL,
    category text NOT NULL,
    priority public."TaskPriority" NOT NULL DEFAULT 'Medium'::public."TaskPriority",
    status public."TaskStatus" NOT NULL DEFAULT 'Not Started'::public."TaskStatus",
    estimated_effort text NULL,
    assignee_id uuid NULL REFERENCES profiles(user_id) ON DELETE SET NULL,
    due_date timestamp with time zone NULL,
    created_by uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    completed_at timestamp with time zone NULL,
    tags text[] NULL,
    external_link text NULL,
    notes text NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_task_management_category ON public.task_management(category);
CREATE INDEX idx_task_management_priority ON public.task_management(priority);
CREATE INDEX idx_task_management_status ON public.task_management(status);
CREATE INDEX idx_task_management_assignee_id ON public.task_management(assignee_id);
CREATE INDEX idx_task_management_created_by ON public.task_management(created_by);
CREATE INDEX idx_task_management_due_date ON public.task_management(due_date);
CREATE INDEX idx_task_management_created_at ON public.task_management(created_at);

-- Create trigger to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_task_management_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_task_management_updated_at
    BEFORE UPDATE ON public.task_management
    FOR EACH ROW
    EXECUTE FUNCTION update_task_management_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.task_management ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Only admins can view all tasks
CREATE POLICY "Admins can view all tasks" ON public.task_management
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.isAdmin = true
        )
    );

-- Only admins can insert tasks
CREATE POLICY "Admins can insert tasks" ON public.task_management
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.isAdmin = true
        )
    );

-- Only admins can update tasks
CREATE POLICY "Admins can update tasks" ON public.task_management
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.isAdmin = true
        )
    );

-- Only admins can delete tasks
CREATE POLICY "Admins can delete tasks" ON public.task_management
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.isAdmin = true
        )
    );

-- Insert some sample data for testing
INSERT INTO public.task_management (
    title,
    description,
    category,
    priority,
    status,
    created_by
) VALUES 
    (
        'Responsive Tables for mobile',
        'Mobile-responsive table layouts',
        'Most Important',
        'Critical',
        'In Progress',
        (SELECT user_id FROM profiles WHERE isAdmin = true LIMIT 1)
    ),
    (
        'QUIZES for chords diagrams',
        'Interactive chord diagram quizzes',
        'Most Important',
        'High',
        'Not Started',
        (SELECT user_id FROM profiles WHERE isAdmin = true LIMIT 1)
    ),
    (
        'Adding lessons only for teachers',
        'Security fix - restrict lesson creation to teachers',
        'Most Important',
        'Critical',
        'Completed',
        (SELECT user_id FROM profiles WHERE isAdmin = true LIMIT 1)
    ),
    (
        'TASKS for students',
        'Assignment/task system for students',
        'Most Important',
        'High',
        'In Progress',
        (SELECT user_id FROM profiles WHERE isAdmin = true LIMIT 1)
    ),
    (
        'Students have access to edit/delete lessons',
        'Security vulnerability - students can modify lessons',
        'Bugs',
        'Critical',
        'Not Started',
        (SELECT user_id FROM profiles WHERE isAdmin = true LIMIT 1)
    ); 