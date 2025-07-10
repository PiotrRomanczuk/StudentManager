import { createClient } from "@/utils/supabase/clients/server";

const sampleTasks = [
  {
    title: "Responsive Tables for mobile",
    description: "Mobile-responsive table layouts",
    category: "Most Important",
    priority: "Critical",
    status: "In Progress",
    estimated_effort: "2 weeks",
    due_date: "2024-02-15",
  },
  {
    title: "QUIZES for chords diagrams",
    description: "Interactive chord diagram quizzes",
    category: "Most Important",
    priority: "High",
    status: "Not Started",
    estimated_effort: "1 week",
    due_date: "2024-02-20",
  },
  {
    title: "Adding lessons only for teachers",
    description: "Security fix - restrict lesson creation to teachers",
    category: "Most Important",
    priority: "Critical",
    status: "Completed",
    estimated_effort: "3 days",
    due_date: "2024-01-30",
  },
  {
    title: "TASKS for students",
    description: "Assignment/task system for students",
    category: "Most Important",
    priority: "High",
    status: "In Progress",
    estimated_effort: "2 weeks",
    due_date: "2024-02-25",
  },
  {
    title: "Students have access to edit/delete lessons",
    description: "Security vulnerability - students can modify lessons",
    category: "Bugs",
    priority: "Critical",
    status: "Not Started",
    estimated_effort: "1 week",
    due_date: "2024-02-10",
  },
  {
    title: "Add infinity scroll for mobile tables",
    description: "Mobile table pagination improvement",
    category: "Bugs",
    priority: "Medium",
    status: "Not Started",
    estimated_effort: "5 days",
    due_date: "2024-02-28",
  },
  {
    title: "Song Table filtration through students",
    description: "Filter songs by student",
    category: "Most Important",
    priority: "Medium",
    status: "Not Started",
    estimated_effort: "1 week",
    due_date: "2024-03-01",
  },
  {
    title: "CSS responsive styles for phones",
    description: "Mobile-first responsive design",
    category: "Most Important",
    priority: "High",
    status: "In Progress",
    estimated_effort: "1 week",
    due_date: "2024-02-18",
  },
];

async function seedTasks() {
  const supabase = await createClient();
  
  try {
    // First, get the first admin user
    const { data: adminUser, error: adminError } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("isAdmin", true)
      .limit(1)
      .single();

    if (adminError || !adminUser) {
      console.error("No admin user found:", adminError);
      return;
    }

    // Insert sample tasks
    for (const task of sampleTasks) {
      const { error } = await supabase
        .from("task_management")
        .insert({
          ...task,
          created_by: adminUser.user_id,
        });

      if (error) {
        console.error("Error inserting task:", error);
      } else {
        console.log(`Inserted task: ${task.title}`);
      }
    }

    console.log("Task seeding completed!");
  } catch (error) {
    console.error("Error seeding tasks:", error);
  }
}

// Run the seeding function
seedTasks(); 