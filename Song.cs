using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


using SongsAPI.Models.Users;

namespace SongsAPI.Models
{
    public class Song
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Level { get; set; }

        [Column("Key")]
        public string? SongKey { get; set; }

        public string? Chords { get; set; }

        public string? AudioFiles { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        public string? Author { get; set; }

        [Column("Ultimate-Guitar Link")]
        public string? UltimateGuitarLink { get; set; }

        public string? ShortTitle { get; set; }

        // Navigation properties for relationships
        public ICollection<Student> FavoriteByStudents { get; set; }
        public ICollection<Lesson> Lessons { get; set; }

        public Song()
        {
            FavoriteByStudents = new HashSet<Student>();
            Lessons = new HashSet<Lesson>();
        }
    }
}
