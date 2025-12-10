using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using TechnoStore.Data;
using TechnoStore.Services;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------
// БД PostgreSQL
// ---------------------------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ---------------------------
// Сервисы
// ---------------------------
builder.Services.AddScoped<AuthService>();

// ---------------------------
// JWT
// ---------------------------
var jwtSection = builder.Configuration.GetSection("Jwt");

var jwtKey = jwtSection["Key"]
             ?? throw new InvalidOperationException("Jwt:Key is not configured in appsettings.json");
var jwtIssuer = jwtSection["Issuer"]
                ?? throw new InvalidOperationException("Jwt:Issuer is not configured in appsettings.json");
var jwtAudience = jwtSection["Audience"]
                  ?? throw new InvalidOperationException("Jwt:Audience is not configured in appsettings.json");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,

            ValidateAudience = true,
            ValidAudience = jwtAudience,

            ValidateLifetime = true
        };
    });

// ---------------------------
// Controllers + JSON
// ---------------------------
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

// ---------------------------
// CORS
// ---------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",   // Vite фронт
                "https://localhost:7215", // Swagger по https
                "http://localhost:7215"   // Swagger по http (если так откроешь)
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddEndpointsApiExplorer();

// ---------------------------
// Swagger + JWT
// ---------------------------
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TechnoStore API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Введіть токен так: Bearer {your JWT token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();


// Swagger
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "TechnoStore API v1");
});

// HTTPS редирект
app.UseHttpsRedirection();

// Раздача статики из wwwroot (картинки, css и т.п.)
app.UseStaticFiles();

// CORS обязательно ДО auth
app.UseCors("AllowAll");

// Auth
app.UseAuthentication();
app.UseAuthorization();

// Контроллеры
app.MapControllers();

app.Run();
