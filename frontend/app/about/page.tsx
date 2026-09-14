import { getServices, resolveImageUrl } from "@/lib/api";

export default async function AboutPage() {
  const services = await getServices();
  const image = services[0]?.image_url || "";

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <span className="badge-pill">من نحن</span>
          <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-ink md:text-4xl">
            قصة <span className="text-brass">GLOSSIA GROUP</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-textmuted">
            كنآمنو أن العناية الرجالية ماشي رفاهية، ولكن أسلوب حياة. جمعنا بين خدمة صالون احترافية ومنتجات أصلية باش كل
            زبون يخرج بلوك مرتب وثقة أكبر.
          </p>
        </div>
        {image ? (
          <div className="card overflow-hidden p-2">
            <img src={resolveImageUrl(image)} alt="GLOSSIA GROUP" className="h-72 w-full rounded-2xl object-cover md:h-96" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
