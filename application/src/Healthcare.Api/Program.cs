using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();

var readinessOptions = new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        await JsonSerializer.SerializeAsync(
            context.Response.Body,
            new { status = report.Status.ToString().ToLowerInvariant() });
    }
};

app.MapHealthChecks("/health", readinessOptions);
app.MapHealthChecks("/health/ready", readinessOptions);
app.MapGet("/health/live", () => Results.Ok(new { status = "healthy" }));

app.Run();

public partial class Program;
