using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace BuildingBlocks.Core
{
    public static class HttpClientExtensions
    {
        public static async Task<TResult> PostAsAsync<TResult>(this HttpClient client, string url, HttpContent content, string oauth2Header = null)
        {
            if (!string.IsNullOrEmpty(oauth2Header))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauth2Header.Split(' ')[1]);

            content.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/json");

            var responseMessage = await client.PostAsync(url, content);

            return JsonConvert.DeserializeObject<TResult>(await responseMessage.Content.ReadAsStringAsync());
        }


        public static async Task<HttpResponseMessage> PostAsync(this HttpClient client, string url, dynamic content, string oauth2Header = null)
        {
            if (!string.IsNullOrEmpty(oauth2Header))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauth2Header.Split(' ')[1]);

            var stringContent = new StringContent(JsonConvert.SerializeObject(content), Encoding.UTF8, "application/json");

            return await client.PostAsync(url, stringContent);
        }

        public static async Task<TOut> PostAsAsync<TIn, TOut>(this HttpClient client, string url, TIn content, string oauth2Header = null)
        {
            if (!string.IsNullOrEmpty(oauth2Header))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauth2Header.Split(' ')[1]);

            var stringContent = new StringContent(JsonConvert.SerializeObject(content), Encoding.UTF8, "application/json");

            var responseMessage = await client.PostAsync(url, stringContent);

            var responseText = await responseMessage.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<TOut>(responseText);
        }

        public static async Task<TOut> PutAsAsync<TIn, TOut>(this HttpClient client, string url, TIn content, string oauth2Header = null)
        {
            if (!string.IsNullOrEmpty(oauth2Header))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauth2Header.Split(' ')[1]);

            var stringContent = new StringContent(JsonConvert.SerializeObject(content), Encoding.UTF8, "application/json");

            var responseMessage = await client.PutAsync(url, stringContent);

            return JsonConvert.DeserializeObject<TOut>(await responseMessage.Content.ReadAsStringAsync());
        }

        public static async Task<T> GetAsync<T>(this HttpClient client, string url, string oauth2Header = null)
        {
            if (!string.IsNullOrEmpty(oauth2Header))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauth2Header.Split(' ')[1]);

            HttpResponseMessage httpResponseMessage = await client.GetAsync(url);

            return JsonConvert.DeserializeObject<T>((await httpResponseMessage.Content.ReadAsStringAsync()));
        }

        public static async Task<T> DeleteAsync<T>(this HttpClient client, string url, string oauth2Header = null)
        {
            if (!string.IsNullOrEmpty(oauth2Header))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauth2Header.Split(' ')[1]);

            HttpResponseMessage httpResponseMessage = await client.DeleteAsync(url);

            return JsonConvert.DeserializeObject<T>((await httpResponseMessage.Content.ReadAsStringAsync()));
        }
    }
}
