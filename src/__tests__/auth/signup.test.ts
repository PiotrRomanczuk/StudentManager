import { signup } from "@/app/auth/signup/actions";
import { createClient } from "@/utils/supabase/clients/server";
import { createServiceClient } from "@/utils/supabase/clients/service";

// Mock the Supabase clients
jest.mock("@/utils/supabase/clients/server");
jest.mock("@/utils/supabase/clients/service");

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockCreateServiceClient = createServiceClient as jest.MockedFunction<typeof createServiceClient>;

describe("signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create a user and profile", async () => {
    // Mock form data
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");

    // Mock the regular client
    const mockSupabaseClient = {
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: { user: { id: "test-user-id" } },
          error: null,
        }),
      },
    };
    mockCreateClient.mockResolvedValue(mockSupabaseClient as any);

    // Mock the service client
    const mockServiceClient = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      }),
    };
    mockCreateServiceClient.mockResolvedValue(mockServiceClient as any);

    const result = await signup(formData);

    expect(result).toEqual({ success: true });
    expect(mockCreateClient).toHaveBeenCalled();
    expect(mockCreateServiceClient).toHaveBeenCalled();
    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should throw error when user creation fails", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");

    const mockSupabaseClient = {
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "User creation failed" },
        }),
      },
    };
    mockCreateClient.mockResolvedValue(mockSupabaseClient as any);

    await expect(signup(formData)).rejects.toThrow("User creation failed");
  });

  it("should throw error when profile creation fails", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");

    const mockSupabaseClient = {
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: { user: { id: "test-user-id" } },
          error: null,
        }),
      },
    };
    mockCreateClient.mockResolvedValue(mockSupabaseClient as any);

    const mockServiceClient = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          error: { message: "Profile creation failed" },
        }),
      }),
    };
    mockCreateServiceClient.mockResolvedValue(mockServiceClient as any);

    await expect(signup(formData)).rejects.toThrow("Profile creation failed");
  });

  it("should throw error when service client creation fails", async () => {
    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "password123");
    formData.append("firstName", "John");
    formData.append("lastName", "Doe");

    const mockSupabaseClient = {
      auth: {
        signUp: jest.fn().mockResolvedValue({
          data: { user: { id: "test-user-id" } },
          error: null,
        }),
      },
    };
    mockCreateClient.mockResolvedValue(mockSupabaseClient as any);

    mockCreateServiceClient.mockRejectedValue(new Error("Service client creation failed"));

    await expect(signup(formData)).rejects.toThrow("Service client creation failed");
  });
}); 