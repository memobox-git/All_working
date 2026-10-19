# 5 AI Infrastructure Projects: script

**Word count (spoken):** about 3,160 words | **Estimated length:** about 21 minutes at 150 words a minute
**Source:** Vishakha Sadhwani's video "5 AI Infrastructure Projects You MUST BUILD Before 2026 Ends!" (youtube.com/watch?v=CRYLJH-myKE). This script keeps her five projects, her order, the four steps and three lessons for each project, and her no-GPU section. Every sentence is new and in Chris's voice, and every fact was checked. What I changed or added is listed at the end.
**Style:** Alex Hormozi's real speaking style (see `skills/hormozi-style`), like the AI agents and AI Solutions Architect scripts:
- "In this video I am going to...", then numbered projects.
- Each project gives the rule, then the steps, a "let's say" example or some math out loud, and a short landing line.
- Terms are defined as "X just means Y".
- Contractions throughout, and simple words.
**Research date:** 19 October 2026

### Before filming
1. **Check the prices on the day.** The AWS prices come from AWS's own price list, published 15 October 2026. Cloud prices change, so re-check the two numbers in Graphic 12 the week you film.
2. **Confirm the lines marked *(Chris to confirm)*.** They speak from your hiring experience.
3. **Add the AI Engineering Masterclass link.** The fixed links line only has the Data Engineering Masterclass.

---

## Research brief

### How the research was done
Chrome was not connected in this cloud session, so the research used yt-dlp and web search. YouTube's default player was blocked, but two other players gave the metadata, the comments and the captions. Eight videos were flagged. Six transcripts were read in full. Two long interview videos and Abhishek Veeramalla's three-hour build were read at their key chapters. The top comments on 11 videos were read. Every technical claim was checked against official docs, the projects' own source code, or the cloud providers' price lists.

### Creators and videos flagged

| # | Creator (subscribers) | Title | Link | Views | Uploaded | Length | Transcript |
|---|---|---|---|---|---|---|---|
| 1 | Vishakha Sadhwani (71.9K) | 5 AI Infrastructure Projects You MUST BUILD Before 2026 Ends! **(the source)** | youtube.com/watch?v=CRYLJH-myKE | 25,186 | 12 Oct 2026 | 15:08 | Full |
| 2 | KodeKloud, Mumshad Mannambeth (473K) | AI Infrastructure Explained (GPUs, vLLM, and LLM-D) | youtube.com/watch?v=hBzUokVYQkI | 379,086 | 18 Aug 2026 | 50:59 | Full |
| 3 | Aishwarya Srinivasan (189K) | 5 AI Engineer Projects to Build in 2026 | youtube.com/watch?v=9WIsvEswZTk | 287,600 | 28 Feb 2026 | 19:41 | Full |
| 4 | Marina Wyss (156K) | How to Build AI Engineering Projects That Get You Interviews | youtube.com/watch?v=3ZDSdMpczXE | 52,327 | 30 Dec 2025 | 18:07 | Full |
| 5 | Abhishek Veeramalla (674K) | 5 AI Projects for DevOps Engineers in 3 Hours | youtube.com/watch?v=e1RxEgxtWV0 | 27,007 | 15 Jun 2026 | 3:03:04 | Partial |
| 6 | Chris Schwenk, Tech Jobber, with Edward Morando (32.1K) | The $400K AI Infrastructure Jobs Nobody's Applying For | youtube.com/watch?v=gOtQAiaav2I | 11,526 | 4 May 2026 | 53:12 | Key chapters |
| 7 | Sunny Savita with Shikha Singh (45.1K) | DevOps to AI Infrastructure Engineer, Real AI Interview Experience | youtube.com/watch?v=82UoYSWaGpk | 6,816 | 30 Jun 2026 | 54:23 | Key chapters |
| 8 | Viktor Farcic, DevOps & AI Toolkit (98.8K) | Kubernetes GPU Autoscaling: Why Scale to Zero Costs You 10 Minutes Per Request | youtube.com/watch?v=wwrPwU-JCMw | 5,370 | 28 Sep 2026 | 36:51 | Full |

Also checked, not flagged:
- KodeKloud, "Understanding vLLM with a Hands On Demo": 89K views, Mar 2026.
- Vishakha's vLLM-on-Kubernetes project video: 18.7K views, Jun 2026.
- Vishakha's "Inference Crash Course": 22K views, Sep 2026.

**What the numbers say:**
- **The biggest videos explain, and the project videos stay small.** KodeKloud's 51-minute explainer has 379K views, and Aishwarya's AI engineer projects video has 288K. The source video sits at 25K after one week.
- **Nobody combines the two.** No video gives the projects, the plain-English explanations, and the costs together. Our script does all three.

### What all of them cover (our script covers these too)
- Kubernetes as the base layer, and vLLM as the default serving engine.
- GPU memory and GPU cost as the main limits.
- Time to first token, time per output token, and latency versus throughput.
- The KV cache, and routing that knows where the cache is.
- Prometheus and Grafana.
- Autoscaling and cold starts.
- "Your DevOps and SRE skills carry over."
- "Measure real numbers and bring them to interviews."

### Where they are wrong, out of date, or disagree
1. **The source's KV cache explanation is muddled.** She says to "think of it as like it is doing the same matrix multiplication again and wasting the GPU work". That describes what happens *without* a cache. She never says the cache stores the keys and values for each token, and she blurs the cache inside one request with prefix caching across requests. Our script says what the cache stores, then shows why a follow-up should go back to the same replica.
2. **"Several minutes" is too kind for a cold start.**
   - BentoML measured about 10 to 11 minutes for Llama 3.1 8B before tuning. Most of that time was pulling and unpacking the image.
   - Viktor Farcic measured more than 10 minutes for a small model on one L4 GPU.
   - In Viktor's test, caching the weights on a network disk saved only about 8%. AWS instead cut one model's load time from 423 seconds to 25 seconds by streaming the weights.
   - Our script says to measure each part before fixing anything.
3. **Scaling down isn't instant either, and no one explains why.**
   - KEDA waits 5 minutes by default before it scales to zero.
   - The Cluster Autoscaler removes a node only after it has sat unneeded for 10 minutes.
   - Our script gives both numbers.
4. **The source's "vLLM router" could mean three things.**
   - The router in vllm-project/production-stack, which is what she describes.
   - vllm-project/router, a Rust router forked from SGLang's.
   - vllm-project/semantic-router, which picks a model and is not a load balancer.
   - Our script names the production-stack router and llm-d, which both do KV-cache-aware routing.
5. **Metric names have changed.**
   - She lists time to first token, inter-token latency and time per output token as three metrics. In vLLM today, time per output token was renamed to inter-token latency.
   - `vllm:gpu_cache_usage_perc` is now `vllm:kv_cache_usage_perc`, and the old name was removed by v0.12.
6. **KServe's mode names changed in v0.16.** "Serverless" is now "Knative" mode, and "RawDeployment" is now "Standard" mode. Only Knative mode can scale to zero, so projects 4 and 5 overlap more than she says. Our script keeps scale to zero in project 5, where she put it.
7. **"Kubernetes for stateful AI workloads" (source) is loose.** vLLM pods usually run as Deployments, not StatefulSets, and KodeKloud says the same. Our script doesn't call them stateful.
8. **Other creators' slips, so we don't repeat them:**
   - KodeKloud gives one Kubernetes adoption figure as "60%" and then "66%".
   - Abhishek says Kubernetes ships a minor release every 3 months. It's three a year, about every 4 months.

### What viewers asked for in the comments
- **Plain English.** "Anyone else watch this whole video and still feel like they understood nothing?" (198 likes, on Aishwarya's video).
- **Real costs, and whether it can be free.** "Can we build these projects completely free of cost?" (source video) and "What's the estimate of what all of these projects could cost?" (Aishwarya).
- **Which laptop works.** One viewer's Mac M1 with 8 GB couldn't run a local model.
- **Whether DevOps and AI infrastructure are the same job,** and what the job titles are (source video).
- **Projects for data engineers** (Aishwarya). Nobody answered.
- **Full projects, not surface explanations** (Vishakha's AIOps and vLLM videos).

### Gaps, and the angle our script takes
1. **Plain English for every term,** in one line each, because the top complaint is jargon.
2. **The money, out loud:**
   - what an idle GPU costs per day and per month;
   - what a three-hour GPU test costs;
   - how to turn a load test into a cost per million tokens.
   No other video prices anything.
3. **Corrected cold start facts.** The script gives the real minutes, says what the slow part usually is, and tells the viewer to measure before fixing. It also covers the scale-down wait.
4. **The data engineer angle.** A queue with workers is a pipeline, with the same questions about failed jobs and jobs that run twice. Nobody makes this link.
5. **How a hiring manager reads the project.** It covers the results table, the README, and the "why that tool?" follow-up, from Chris's 200+ interviews.
6. **A clearer no-GPU section.** It names an 8 GB laptop model, kind or minikube, vLLM's CPU version, the cheap three-hour test, and free GPU notebooks.

### Source for every number and fact in the script

| Fact in script | Source | Date |
|---|---|---|
| 8× H100 server about $55 an hour; 1× L4 server about $0.80 an hour (AWS p5.48xlarge $55.04, g6.xlarge $0.8048, Linux on-demand, us-east-1) | AWS EC2 on-demand price list, aws.amazon.com/ec2/pricing/on-demand | Published 15 Oct 2026 |
| $0.80 × 24 = about $19 a day; × 30 = about $580 a month; $55 × 730 hours = about $40,000 a month | Worked out from the prices above | — |
| Posted base pay of about $230K to $500K for senior AI infrastructure roles at top AI labs (Anthropic Staff+ SWE, Kubernetes Platform $320K–$485K; OpenAI SWE, Model Inference $266K–$500K; OpenAI SWE, GPU Infrastructure $230K–$490K) | job-boards.greenhouse.io/anthropic/jobs/5211241008; jobs.ashbyhq.com/openai/83b6755d-7785-4186-9050-5ef3ad127941; jobs.ashbyhq.com/openai/f58cb1eb-9642-4a4d-a14d-d7a57d583a11 | Live postings, 19 Oct 2026 |
| Ollama is free and open source (MIT), runs models locally, with a local API | github.com/ollama/ollama; docs.ollama.com/api | Checked 19 Oct 2026 |
| Open weight means the weights are downloadable; that is not the same as open source under OSI's definition | opensource.org/ai/open-source-ai-definition | v1.0, Oct 2024 |
| A 7B model at 2 bytes a parameter is about 14 GB | NVIDIA, "Mastering LLM Techniques: Inference Optimization", developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization | 17 Nov 2023 |
| Qwen2.5-Coder 7B on Ollama (4-bit default) is a 4.7 GB download; 1.5B is 986 MB | ollama.com/library/qwen2.5-coder/tags | Checked 19 Oct 2026 |
| llmfit checks your hardware and recommends models that fit (MIT, open source) | github.com/AlexsJones/llmfit | v1.1.17, 8 Oct 2026 |
| vLLM started at UC Berkeley's Sky Computing Lab and is hosted by the PyTorch Foundation; OpenAI-compatible server; continuous batching | github.com/vllm-project/vllm; pytorch.org/blog/pytorch-foundation-welcomes-vllm | 6 May 2025 |
| SGLang is a production serving framework | docs.sglang.io | Checked 19 Oct 2026 |
| NVIDIA GPU Operator installs the driver, device plugin and toolkit; pods request `nvidia.com/gpu` | docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html; kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus | Checked 19 Oct 2026 |
| The production-stack router has round-robin, session, prefix-aware and KV-aware modes | github.com/vllm-project/production-stack (source: `src/vllm_router/parsers/parser.py`) | Checked 19 Oct 2026 |
| llm-d does KV-cache-aware routing; CNCF Sandbox since 12 Mar 2026 | cncf.io/projects/llm-d; github.com/llm-d/llm-d-router | 2026 |
| The KV cache saves the key and value tensors so they aren't recomputed for every new token; prefix caching reuses it across requests, on by default | NVIDIA blog above; docs.vllm.ai/en/latest/features/automatic_prefix_caching.html | Checked 19 Oct 2026 |
| vLLM publishes time to first token, inter-token latency, KV cache usage and requests waiting | `vllm/v1/metrics/loggers.py` on main; docs.vllm.ai/en/latest/design/metrics.html | Checked 19 Oct 2026 |
| GitOps: Git holds the desired state, pulled and reconciled automatically | opengitops.dev (v1.0.0) | Checked 19 Oct 2026 |
| Argo CD, Prometheus, Grafana, Loki roles | cncf.io/projects/argo; prometheus.io; grafana.com/docs | Checked 19 Oct 2026 |
| Kubernetes restarts failed containers and replaces failed pods | kubernetes.io/docs/concepts/architecture/self-healing | Checked 19 Oct 2026 |
| KServe: InferenceService, autoscaling on concurrency (default metric) | kserve.github.io/website (KPA autoscaler docs); cncf.io/projects/kserve | v0.20 docs |
| Pending pods trigger the cluster autoscaler to add nodes | kubernetes.io/docs/concepts/cluster-administration/node-autoscaling | Checked 19 Oct 2026 |
| KEDA: Kubernetes Event-driven Autoscaling, Redis list scaler, minimum 0, 5-minute default cooldown | keda.sh/docs/latest/scalers/redis-lists; keda.sh/docs/latest/reference/scaledobject-spec | v2.21 |
| Cluster Autoscaler removes a node after it is unneeded for 10 minutes by default | github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md | Checked 19 Oct 2026 |
| Official vLLM image about 9 GB compressed (amd64) | Docker Hub, vllm/vllm-openai v0.32.0 | 18 Oct 2026 |
| About 10 minutes cold start for an 8B model before tuning, mostly image pull and unpacking | BentoML, "25x faster cold starts for LLMs on Kubernetes", bentoml.com/blog/25x-faster-cold-starts-for-llms-on-kubernetes | Checked 19 Oct 2026 |
| AWS cut one model's weight load from 423 s (about 7 minutes) to 25 s by streaming the weights | AWS Containers blog, "Fast model loading for AI inference on Amazon EKS" | 1 Sep 2026 |
| Cloud Run GPUs scale to zero; AKS has a managed KEDA add-on; Karpenter removes empty nodes | cloud.google.com/blog/products/serverless/cloud-run-gpus-are-now-generally-available; learn.microsoft.com/en-us/azure/aks/keda-about; karpenter.sh/docs/concepts/disruption | Jun 2025; checked 19 Oct 2026 |
| vLLM has a CPU version | docs.vllm.ai/en/latest/getting_started/installation/cpu.html | Checked 19 Oct 2026 |
| kind runs Kubernetes in Docker containers; minikube supports NVIDIA GPUs on Linux | kind.sigs.k8s.io; minikube.sigs.k8s.io/docs/tutorials/nvidia | Checked 19 Oct 2026 |
| Colab and Kaggle give free GPU time with changing limits | research.google.com/colaboratory/faq.html (Kaggle's quota, about 30 hours a week, is widely reported but its page could not be read, so the script doesn't give a number) | Checked 19 Oct 2026 |

**Numbers that are "let's say" examples, not data:**
- 50 tokens a second for one user, 30 each for 32 users.
- 4 requests per replica, 40 requests, a node pool with 4 GPUs.
- A cold start cut from ten minutes to three.
- 500 tokens a second from the L4 server, giving about 44 cents per million tokens.

Each one is introduced with "let's say", and the graphics carry a "Let's say" label.

---

## Script

### Hook

**[On camera]**

One cloud server with eight H100 GPUs costs about fifty-five dollars an hour on AWS, and it charges you the same whether a thousand people are using your model or nobody is. Keeping that model fast and that bill low is the job of an AI infrastructure engineer.

### Promise

**[On camera]**

In this video I am going to show you five AI infrastructure projects that take you from running a model on your laptop to running GPUs that switch themselves off. For each one, you'll get what it is, the four steps to build it, and what it teaches you. Then I'll show you how to build all five without a GPU, and how to present them so they actually help you get hired.

### Intro

**[PAUSE] [Intro motion graphic, full screen: intro.mp4]**

If you are new here, I am Chris. I have worked in data engineering for more than ten years. I have interviewed more than two hundred engineers for companies in healthcare, banking, automotive, and financial exchanges. Today I run Stackle, where I teach data and AI engineering, and more than thirteen thousand people follow me on LinkedIn.

**[PAUSE]**

### Part 1: What an AI infrastructure engineer does

**[On camera]**

An AI infrastructure engineer builds and runs the systems that AI models run on. Somebody else trains the model, and somebody else builds the app on top of it. The infrastructure engineer makes sure it runs fast, stays up, and doesn't burn money. That's the job.

**[PAUSE] [Graphic 1, full screen: "AI infrastructure" as one heading over seven boxes: "Model serving", "Inference performance", "GPU infrastructure", "Scaling", "Observability", "Storage and data", "Cost"]**

AI infrastructure is really seven areas under one name: model serving, inference performance, GPU infrastructure, scaling, observability, storage and data, and cost. Inference just means the model answering a request, like a chatbot writing its reply to you. You don't need all seven on day one. These five projects take you through most of them.

**[PAUSE]**

**[Card beside you: "Senior AI infrastructure jobs at top AI labs: about $230K to $500K base salary (posted ranges, San Francisco)"]**

And companies pay for it. Senior infrastructure jobs at the top AI labs post base salaries from about two hundred thirty thousand to five hundred thousand dollars. Those are senior roles in San Francisco, so it's not typical pay. But it tells you what this work is worth.

**[On camera]**

If you already work in DevOps, platform engineering, site reliability, or data engineering, you're closer to this job than you think. Containers, Kubernetes, monitoring, and pipelines are already half of it. The new half is what happens when the thing inside the container is a model that needs a GPU.

**[PAUSE] [Graphic 2, full screen: five numbered boxes in a row, each with the skill it adds: "1 Dockerfile generator: containers and local models", "2 vLLM on Kubernetes: model serving", "3 DevOps and AIOps: observability", "4 KServe on GPUs: autoscaling", "5 KEDA scale to zero: cost"]**

So here are the five: a Dockerfile generator on your laptop, a model serving stack on Kubernetes, a platform that watches and fixes itself, GPU autoscaling, and scale to zero, which is all about cost. Each project uses the skills from the one before it. That's why the order matters.

**[PAUSE]**

**[Card beside you: "Before you start: Docker, Python, Linux, shell scripting, Kubernetes basics"]**

Before you start, get the basics in place: Docker, Python, Linux, a little shell scripting, and basic Kubernetes. Kubernetes just means a system that runs your containers across many machines and restarts them when they fail. Skip the basics, and you'll spend your weekend fixing config files instead of learning about models, right?

### Project 1: A Dockerfile generator with a local model

**[On camera]**

Number one is a Dockerfile generator, and it's the best place to start because it teaches you two things at once: running a model yourself, and working with containers. You build a small Python tool that looks at a code project and writes its Dockerfile, which is the recipe Docker follows to package an app into a container.

**[Card beside you: "Ollama: runs models on your own machine" and "Open-weight model: the trained model file is public"]**

You run the model with Ollama, a free, open-source tool that runs models on your own machine and gives your code a local API to call. And you use an open-weight model, which just means the trained model file is public, so you can download it from a site like Hugging Face. Ollama is great for learning. In production, teams use a serving engine like vLLM or SGLang, and that's project two.

**[PAUSE] [Graphic 3, full screen, labelled "Let's say": "7 billion parameters × 2 bytes = 14 GB", then "4-bit: 7 billion × half a byte = about 4 to 5 GB", then "Qwen2.5-Coder 7B on Ollama: a 4.7 GB download"]**

Step one is picking a model that fits your machine, and you can do the math in your head. Parameters are the numbers a model learned in training, and at normal precision each one takes two bytes. So let's say you pick a seven-billion-parameter code model, like Qwen2.5-Coder. Seven billion times two bytes is fourteen gigabytes, before it does any work. Now take the 4-bit version, where each number is stored with less detail, like saving a photo at a smaller size. At half a byte each, it's about four to five gigabytes, and on Ollama it's a four point seven gigabyte download. That fits on a normal laptop. And a free tool called llmfit checks your machine and tells you which models fit. It's linked in the description.

**[PAUSE]**

**[On camera]**

Step two is giving the model the right context. Your script reads the files that describe the project, like requirements.txt for Python, package.json for Node.js, or go.mod for Go. It sends them to Ollama's local API, and the model writes a Dockerfile back.

**[PAUSE] [Graphic 4, full screen: a loop: "Read the project files" → "Ask the model" → "docker build" → "Passed? Done." or "Failed? Send the error back (up to 3 tries)". Under it, the scorecard: "Python, Node.js, Go: built first time / needed a fix / never worked"]**

Step three is building it for real. Your tool runs docker build, and if the build fails, it sends the error back to the model and asks for a fix. Give it a limit, like three tries, so a bad answer doesn't loop forever. Step four is testing it on Python, Node.js, and Go projects, with a scorecard of what built first time, what needed a fix, and what never worked.

**[PAUSE]**

**[On camera]**

So project one teaches you how model size changes memory and speed, and what a good Dockerfile looks like, from the base image to the layers and caching. And most of all, it teaches you to check AI output instead of trusting it. A Dockerfile that builds isn't always a good Dockerfile. Check everything.

### Project 2: A production serving stack on Kubernetes

**[On camera]**

Number two is a production serving stack on Kubernetes. Project one ran a model for you. Project two asks what it takes to serve that model to thousands of people at once. You deploy it on Kubernetes with vLLM, and you install it with Helm, which is a package manager for Kubernetes.

**[Card beside you: "vLLM: the engine between the model and the GPU"]**

vLLM is the heart of this project. vLLM just means an open-source inference engine, the software between the model and the GPU that gets as many answers out of that GPU as it can. It started at UC Berkeley, and today the PyTorch Foundation hosts it.

**[PAUSE] [Graphic 5, full screen: the stack: "Users" → "Router" → three "vLLM" boxes, each on a GPU, with "Prometheus" and "Grafana" watching all three]**

Step one is getting one copy running. You create a Kubernetes cluster with a GPU node, and you install NVIDIA's GPU Operator, so the cluster can find the GPUs and hand them out. Then you deploy vLLM and call it through its OpenAI-compatible API, so your code talks to it the same way it would talk to OpenAI. Step two is adding more replicas, which are copies of the same model server, with a router in front. The vLLM project ships one in its production stack, and it decides which copy gets each request. Now it's a real stack.

**[PAUSE]**

**[PAUSE] [Graphic 6, full screen: "Request 1: chat history + question" goes to "Replica A", which saves its notes (KV cache). "Request 2: same chat history + follow-up" goes to the router. One arrow to "Replica A: notes already there, skip ahead". A crossed-out arrow to "Replica B: rebuild everything"]**

Step three is smart routing, and it's one of the most important ideas in inference right now. When a model reads your prompt, it saves working notes for every token, so it doesn't redo that work for each new word it writes. Those notes are the KV cache, and a token just means a small piece of a word. So let's say you're chatting with a model. Every follow-up sends the whole conversation again. If it lands on the replica that already has the notes, it skips straight to the new part. If it lands somewhere else, that replica rebuilds everything, and you pay for the same GPU work twice. And so a smart router sends each request to the replica that already holds its KV cache. That's called KV-cache-aware routing, and the vLLM router and a project called llm-d both do it.

**[PAUSE]**

**[PAUSE] [Graphic 7, full screen: four dials: "Time to first token", "Inter-token latency", "KV cache usage", "Requests waiting"]**

Step four is watching it, with Prometheus collecting metrics and Grafana showing them on a dashboard. Time to first token is how long you wait for the first word. Inter-token latency, also called time per output token, is how fast the rest follow. KV cache usage shows how full the GPU's memory is, and requests waiting shows the queue. vLLM publishes all four out of the box.

**[PAUSE]**

**[PAUSE] [Graphic 8, full screen, labelled "Let's say": "1 user: 50 tokens a second", then "32 users: 30 tokens a second each", then "32 × 30 = 960 tokens a second in total"]**

So project two teaches you how an inference engine works, why companies run AI on Kubernetes, and one trade-off that matters more than any tool. Latency is how fast one person gets an answer, and throughput is how much the whole system answers per second. So let's say one user alone gets fifty tokens a second. Now thirty-two people share the GPU, and each one gets thirty. Thirty-two times thirty is nine hundred sixty tokens a second in total. That's continuous batching at work, which just means the engine adds new requests the moment there's room, like a lift that lets people on at every floor. Each person waits a little longer, but the system answers far more. That's the trade-off between latency and throughput.

**[PAUSE]**

### Project 3: A DevOps and AIOps platform

**[On camera]**

Number three is an end-to-end DevOps and AIOps platform. Your systems are running, so now the question is how you keep them healthy. AIOps just means using AI to help run operations, like reading alerts and logs faster than a person can.

**[PAUSE] [Graphic 9, full screen: four layers stacked: "1 GitOps: deploy from Git (Argo CD)", "2 Observability: Prometheus, Grafana, Loki, alerts", "3 AIOps: an LLM summarises alerts and logs and suggests a cause", "4 Safe actions: restart a pod, scale up. Risky ones wait for a human"]**

Step one is the DevOps foundation: a real application on Kubernetes, deployed with GitOps. GitOps just means Git holds the true version of your setup, and a tool like Argo CD keeps the cluster matching it. Step two is observability: metrics in Prometheus, dashboards in Grafana, logs in one place with a tool like Loki, and alerts only for things that matter. Step three is the AIOps layer, where a large language model turns the flood of alerts and logs into a short incident summary with the likely cause. And step four is automating a few responses, carefully. For a known pattern, the system can restart a pod or scale up by itself. Anything risky waits for a human.

**[PAUSE]**

**[Card beside you: "Break it on purpose: crash a service, fill a disk, flood an API"]**

Then break things on purpose. Crash a service, fill up a disk, or flood an API, and see if your system catches it, explains it, and suggests the right next step. If it doesn't, you just found your next fix.

**[On camera]**

So project three teaches you that observability is a skill, not a set of tools, because the hard part is knowing what to measure and when to wake someone up. It teaches you to get from "something is wrong" to "here's the cause" fast. And it teaches you where AI should never act alone. The project comes before the GPU work for a reason. When a GPU workload breaks, every minute costs real money, so you want the alarms in place first.

### Project 4: GPU autoscaling with KServe

**[On camera]**

Number four is GPU autoscaling, and this is where GPUs really come in. You serve the model with KServe, an open-source Kubernetes platform for serving models. You describe your model in one file called an InferenceService, and KServe handles the serving and the scaling.

**[Card beside you: "1 GPU node pool, drivers, device plugin", "2 Deploy an InferenceService with a GPU", "3 Autoscale on concurrency", "4 Load test"]**

Step one is a cluster with a GPU node pool, which is a group of GPU machines the cluster can add or remove. Check that the drivers and NVIDIA's device plugin work, so a pod can ask for a GPU the way it asks for memory. Step two is deploying your model as an InferenceService with a GPU. Step three is autoscaling on concurrency, which just means how many requests each copy handles at the same moment.

**[PAUSE] [Graphic 10, full screen, labelled "Let's say": "Target: 4 requests per replica", then "40 requests ÷ 4 = 10 replicas", then "1 GPU each = 10 GPUs", then "Your node pool has 4 GPUs: 6 pods Pending"]**

So let's do the math. Let's say your target is four requests per replica, and you send forty at once. Forty divided by four is ten, so KServe wants ten replicas. Each replica needs a GPU, so that's ten GPUs. But your node pool only has four. Four pods start, and six sit there marked Pending, waiting for a machine. That's your bottleneck.

**[PAUSE]**

**[PAUSE] [Graphic 11, full screen: two timelines: "Level 1: more pods on free GPUs: fast" and "Level 2: a new GPU machine: minutes", with the parts of level 2 underneath: "start the machine", "install the drivers", "pull the image", "load the model"]**

Step four is load testing, with a tool like k6 or Locust sending lots of requests at once. You'll see two levels of scaling. First, the pods scale up, and that's quick when there's a free GPU. Second, when there isn't one, the cluster autoscaler has to add a whole new GPU machine, and that takes minutes. Measure both, because those two numbers are the best thing this project gives you.

**[PAUSE]**

**[On camera]**

So project four teaches you how Kubernetes hands out GPUs, why scaling pods and scaling machines feel so different, and how to load test. And you walk away with real numbers. Interviewers love real numbers.

### Project 5: Scale to zero with KEDA

**[On camera]**

Number five is scale to zero with KEDA, and it takes on the biggest practical problem in AI infrastructure, which is cost.

**[PAUSE] [Graphic 12, full screen: "1 GPU (L4): $0.80 an hour × 24 = about $19 a day", then "× 30 = about $580 a month", then "8 GPUs (H100): $55 an hour = about $40,000 a month", then "Used 2 hours a day? You still pay for 24". Source line: "AWS on-demand prices, us-east-1, October 2026"]**

So let's do the math. A small cloud server with one GPU costs about eighty cents an hour on AWS. Eighty cents times twenty-four hours is about nineteen dollars a day. Times thirty days, that's close to six hundred dollars a month. And the big server with eight H100 GPUs, at fifty-five dollars an hour, is about forty thousand dollars a month. That's real money. Now let's say your users only need it two hours a day. You still pay for all twenty-four, so eleven out of every twelve dollars pay for nothing.

**[PAUSE]**

**[On camera]**

Scale to zero just means that when there's no work, you run zero copies of the model, and so you pay for zero GPU machines. KEDA, which stands for Kubernetes Event-driven Autoscaling, makes that happen. It scales your pods based on outside signals, like how many jobs are waiting in a queue.

**[PAUSE] [Graphic 13, full screen: "Request" → "Redis queue" → "vLLM workers on GPU nodes" → "Answer". "KEDA" watches the queue. Two states: "Queue empty: 0 workers, 0 GPU nodes" and "New request: scale up"]**

Here's how it fits together. A request goes into a Redis queue, and Redis is a very fast in-memory database that holds the list of jobs. vLLM workers on GPU nodes pick jobs off the queue and write the answers back. KEDA watches the queue. When it's empty, KEDA scales the workers to zero, and when a request lands, it scales them back up.

**[PAUSE]**

**[On camera]**

If you're a data engineer, you know this pattern already, because workers pulling from a queue is how a lot of data pipelines run. And so you already know the questions that matter, like what happens when a job fails halfway, or when the same job runs twice. The only new part is that every worker needs a GPU.

**[Card beside you: "1 Redis queue and a producer", "2 vLLM workers that read the queue", "3 KEDA: scale on queue length, minimum 0", "4 Test the full cycle"]**

Step one is the Redis queue and a small producer, which is a script that pushes requests into it. Step two is the vLLM workers that read the queue and write the answers back. Step three is setting KEDA to scale on queue length, with a minimum of zero. And step four is testing the full cycle: let it drop to zero, send one request, and time how long the answer takes.

**[PAUSE] [Graphic 14, full screen: "Cold start = 1 start a GPU machine + 2 pull the image (vLLM's is about 9 GB) + 3 load the weights into GPU memory", then "Before tuning: about 10 minutes, mostly the image (BentoML, 8B model)"]**

The time you just measured is called the cold start, and it's the real lesson of this project. A cold start has three parts. The cloud starts a GPU machine, the machine pulls the container image, and the model weights load into GPU memory. The official vLLM image alone is about nine gigabytes. BentoML, a company that builds tools for serving models, measured about ten minutes for an eight-billion-parameter model before they tuned anything, and most of that time went on pulling and unpacking the image.

**[PAUSE]**

**[Card beside you: "Measure each part first", "Slow image? Make it smaller or cache it", "Slow weights? Stream them (AWS: 7 minutes to 25 seconds)", "Busy hours? Keep one warm replica"]**

And so measure each part before you fix anything. If the image is the slow part, make it smaller or cache it on the machine. If the weights are the slow part, stream them, which is how AWS cut one model's load time from about seven minutes to twenty-five seconds. And for busy hours, keep one warm replica, which just means one copy that never scales to zero.

**[On camera]**

Going to zero takes time too. By default, KEDA waits five minutes after the queue empties, and the cluster autoscaler waits another ten. And Google Cloud, Azure and AWS each have their own ways to scale GPUs to zero on their managed services, so check yours first.

So project five teaches you queue-based scaling, which fits batch jobs but not a live chat app, where people expect a reply in seconds. And it teaches you cold start optimization, which a lot of teams are working on right now. Explain that trade-off clearly, and you understand AI infrastructure beyond the tools.

### Part 3: No GPU? Build them anyway

**[On camera]**

Now, the question I know a lot of you have: what if you don't have a GPU, or you don't want to pay for one?

**[PAUSE] [Graphic 15, full screen: three rows: "Project 1: your laptop. 8 GB of memory? Qwen2.5-Coder 1.5B is under 1 GB", "Projects 2 to 5: kind or minikube + a small model on the CPU", "A real GPU test: $0.80 an hour × 3 hours = about $2.40, or free time on Google Colab and Kaggle"]**

Project one runs on your laptop by design, and even with eight gigabytes of memory, you can run the one-and-a-half-billion-parameter Qwen2.5-Coder, which is under a gigabyte. For the Kubernetes projects, run a cluster on your own machine with kind or minikube, and use a small model on the CPU. vLLM even has a CPU version now. It's slower, but the patterns don't change. Autoscaling still scales, the queue still fills up, and KEDA still takes your workers to zero.

**[PAUSE]**

**[On camera]**

And when you want a real GPU test, it's cheaper than you think. Let's say you rent that eighty-cent server for three hours. That's about two dollars and forty cents. Then shut it down. Google Colab and Kaggle also give you some free GPU time, though the limits change, so check your account. And if you do have GPUs, build the projects, break them, benchmark them, and write it all down.

### Part 4: How to show these projects

**[On camera]** *(Chris to confirm.)*

Now, what makes these projects actually help you get hired? I've interviewed more than two hundred engineers, and a project only helps you if you can talk about it with numbers. "I deployed vLLM on Kubernetes" tells me you followed a tutorial. But let's say you tell me your cold start was ten minutes, you found the image was the slow part, and you got it down to three. Now I know you did the work.

**[PAUSE] [Graphic 16, full screen: a results table with four columns, "Users at once", "Time to first token", "Tokens a second", "Cost per million tokens", and rows for 1, 8 and 32 users. Under it, labelled "Let's say": "500 tokens a second × 3,600 seconds = 1.8 million tokens an hour", then "$0.80 ÷ 1.8 million = about 44¢ per million tokens"]**

So give every project a results table. Run your load test at a few levels, like one, eight, and thirty-two users at once, and write down the time to first token and the tokens per second for each. Then turn it into money. Let's say your eighty-cent server makes five hundred tokens a second. Five hundred times three thousand six hundred seconds is one point eight million tokens an hour, for eighty cents. That's about forty-four cents per million tokens. Now you can compare your setup with any API price, and that's a conversation most engineers can't have.

**[PAUSE]**

**[Card beside you: "Every README: architecture diagram, results table, what broke and how you fixed it, what you'd do next"]**

Then put it all in a README: the architecture diagram, that table, what broke and how you fixed it, and what you'd do next. And be ready for the follow-up question: why did you pick that tool, and what would you use instead? Most people only push the code. The README with numbers is what gets you the conversation.

### Your turn

**[On camera]**

So here's your one task for this week. Build project one this weekend. Get a small code model running with Ollama, point your script at one of your own projects, and see if the Dockerfile builds. Then write down one number: how many tries it took. Most people will save this video and never open it again. Build it this weekend, and you're already ahead of them.

### Call to action

**[PAUSE] [CTA motion graphic, full screen: cta.mp4]**

If you want help working out which project fits your next role, book a free fifteen-minute career call with me. The link is in the description. And if you want a structured path with real projects and feedback, the Stackle AI Engineering Masterclass is linked there too.

**[PAUSE]**

**[On camera]**

Tell me in the comments which project you're starting with: one, two, three, four, or five.

---

## Graphics list

There are 16 full-screen graphics. Graphic 2, the five projects, can be reused at the start of each project with that project's box lit.

1. **The seven areas:** "AI infrastructure" over seven boxes: "Model serving", "Inference performance", "GPU infrastructure", "Scaling", "Observability", "Storage and data", "Cost".
2. **The five projects:** five numbered boxes, each with the skill it adds:
   - "1 Dockerfile generator: containers and local models"
   - "2 vLLM on Kubernetes: model serving"
   - "3 DevOps and AIOps: observability"
   - "4 KServe on GPUs: autoscaling"
   - "5 KEDA scale to zero: cost"
3. **Model memory math,** labelled "Let's say", one line at a time:
   - "7 billion parameters × 2 bytes = 14 GB"
   - "4-bit: 7 billion × half a byte = about 4 to 5 GB"
   - "Qwen2.5-Coder 7B on Ollama: a 4.7 GB download"
4. **The build loop:** "Read the project files" → "Ask the model" → "docker build" → "Passed? Done." or "Failed? Send the error back (up to 3 tries)". Underneath is the scorecard: "Python, Node.js, Go: built first time / needed a fix / never worked".
5. **The serving stack:** "Users" → "Router" → three "vLLM" boxes, each on a GPU, with "Prometheus" and "Grafana" watching all three.
6. **The KV cache:**
   - "Request 1: chat history + question" goes to "Replica A", which saves its notes (KV cache).
   - "Request 2: same chat history + follow-up" goes to the router.
   - One arrow goes to "Replica A: notes already there, skip ahead".
   - A crossed-out arrow goes to "Replica B: rebuild everything".
7. **Four dials:** "Time to first token", "Inter-token latency", "KV cache usage", "Requests waiting".
8. **Latency versus throughput,** labelled "Let's say":
   - "1 user: 50 tokens a second"
   - "32 users: 30 tokens a second each"
   - "32 × 30 = 960 tokens a second in total"
9. **Four layers:**
   - "1 GitOps: deploy from Git (Argo CD)"
   - "2 Observability: Prometheus, Grafana, Loki, alerts"
   - "3 AIOps: an LLM summarises alerts and logs and suggests a cause"
   - "4 Safe actions: restart a pod, scale up. Risky ones wait for a human"
10. **KServe math,** labelled "Let's say":
    - "Target: 4 requests per replica"
    - "40 requests ÷ 4 = 10 replicas"
    - "1 GPU each = 10 GPUs"
    - "Your node pool has 4 GPUs: 6 pods Pending"
11. **Two levels of scaling:** "Level 1: more pods on free GPUs: fast" and "Level 2: a new GPU machine: minutes". Underneath are the parts of level 2: "start the machine", "install the drivers", "pull the image", "load the model".
12. **The idle GPU bill:**
    - "1 GPU (L4): $0.80 an hour × 24 = about $19 a day"
    - "× 30 = about $580 a month"
    - "8 GPUs (H100): $55 an hour = about $40,000 a month"
    - "Used 2 hours a day? You still pay for 24"
    - Source line: "AWS on-demand prices, us-east-1, October 2026"
13. **Scale to zero:** "Request" → "Redis queue" → "vLLM workers on GPU nodes" → "Answer". "KEDA" watches the queue. Two states: "Queue empty: 0 workers, 0 GPU nodes" and "New request: scale up".
14. **The cold start:** "Cold start = 1 start a GPU machine + 2 pull the image (vLLM's is about 9 GB) + 3 load the weights into GPU memory". Under it: "Before tuning: about 10 minutes, mostly the image (BentoML, 8B model)".
15. **No GPU:**
    - "Project 1: your laptop. 8 GB of memory? Qwen2.5-Coder 1.5B is under 1 GB"
    - "Projects 2 to 5: kind or minikube + a small model on the CPU"
    - "A real GPU test: $0.80 an hour × 3 hours = about $2.40, or free time on Google Colab and Kaggle"
16. **The results table:**
    - Four columns: "Users at once", "Time to first token", "Tokens a second", "Cost per million tokens".
    - Rows for 1, 8 and 32 users.
    - Underneath, labelled "Let's say": "500 tokens a second × 3,600 seconds = 1.8 million tokens an hour", then "$0.80 ÷ 1.8 million = about 44¢ per million tokens".

**Cards beside you:**
- The salary card.
- Before you start.
- Ollama and open-weight models.
- vLLM.
- Break it on purpose.
- The four KServe steps.
- The four KEDA steps.
- The cold start fixes.
- The README checklist.

**Existing motion graphics:** intro.mp4 and cta.mp4 in `stackle-video/graphics/`.

**On-screen labels I shortened or made up (please check):**
- The skill labels on Graphic 2.
- The "notes" wording on Graphic 6.
- The scorecard labels on Graphic 4.
- The two level labels on Graphic 11.
- The column names on Graphic 16.

All other on-screen text uses the script's words.

**Style:** Plus Jakarta Sans. Amber #F59E0B on dark charcoal #1E1C1D, or amber #BA7517 on cream #FAF8F1.

**Thumbnail ideas:**
1. Chris beside a GPU server with a price tag reading "$55/HOUR", and the text "5 AI INFRA PROJECTS".
2. The five project boxes in a row, with "NO GPU NEEDED" across them.

---

## Title

**AI Infrastructure Projects: 5 to Build in 2027 (Even Without a GPU)** (67 characters)

Other options: "5 AI Infrastructure Projects That Get You Hired (No GPU Needed)" (63) or "AI Infrastructure Engineer: 5 Projects From Laptop to GPUs" (58).

## Description

One cloud server with eight H100 GPUs costs about $55 an hour, whether anyone uses your model or not, and keeping that model fast and that bill low is the job of an AI infrastructure engineer. In this video, I show you five AI infrastructure projects, from a model on your laptop to GPUs that switch themselves off. For each one, you get the four steps to build it and what it teaches you, plus how to build all five without a GPU and how to present them in interviews.

**Chapters**
0:00 What an idle GPU costs
--:-- What an AI infrastructure engineer does
--:-- Project 1: Dockerfile generator with a local model
--:-- Project 2: Production serving stack with vLLM on Kubernetes
--:-- Project 3: DevOps and AIOps platform
--:-- Project 4: GPU autoscaling with KServe
--:-- Project 5: Scale to zero with KEDA
--:-- No GPU? Build them anyway
--:-- How to show these projects
--:-- Your task this week

**Book a free 15-minute career call:** https://calendar.app.google/2HjLnF1HSov9m5Gk9
**Stackle AI Engineering Masterclass:** [ADD LINK]

**Tools from the video**
- Ollama: https://ollama.com
- llmfit (which models fit your machine): https://github.com/AlexsJones/llmfit
- vLLM: https://docs.vllm.ai
- vLLM production stack (Helm chart and router): https://github.com/vllm-project/production-stack
- llm-d: https://llm-d.ai
- KServe: https://kserve.github.io/website
- KEDA Redis list scaler: https://keda.sh/docs/latest/scalers/redis-lists/

**Sources**
- AWS EC2 on-demand prices (g6.xlarge, p5.48xlarge, us-east-1): https://aws.amazon.com/ec2/pricing/on-demand/
- Posted pay ranges: https://job-boards.greenhouse.io/anthropic/jobs/5211241008 , https://jobs.ashbyhq.com/openai/83b6755d-7785-4186-9050-5ef3ad127941 , https://jobs.ashbyhq.com/openai/f58cb1eb-9642-4a4d-a14d-d7a57d583a11
- NVIDIA, LLM inference optimization (model memory, KV cache): https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/
- vLLM automatic prefix caching: https://docs.vllm.ai/en/latest/features/automatic_prefix_caching.html
- KEDA ScaledObject defaults: https://keda.sh/docs/latest/reference/scaledobject-spec/
- Cluster Autoscaler FAQ (10-minute scale-down): https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md
- BentoML, faster cold starts for LLMs on Kubernetes: https://www.bentoml.com/blog/25x-faster-cold-starts-for-llms-on-kubernetes
- AWS, fast model loading for AI inference on Amazon EKS: https://aws.amazon.com/blogs/containers/fast-model-loading-for-ai-inference-on-amazon-eks/
- Cloud Run GPUs: https://cloud.google.com/blog/products/serverless/cloud-run-gpus-are-now-generally-available

Book a Call — https://calendar.app.google/2HjLnF1HSov9m5Gk9 | LinkedIn — https://www.linkedin.com/in/crispusroshan | DE Roadmap — https://stackle.io/resources/data-engineering-roadmap | DE Masterclass — https://stackle.io/courses/data-engineering-masterclass-get-job-ready-in-10-weeks | Meetup — https://www.meetup.com/stackle-your-career-lab

---

## Things I added that the source did not have (please check)

1. **The source is another creator's video.** The five projects, their order, the four steps and the three lessons for each follow Vishakha Sadhwani's video closely.
   - Every sentence, hook and example here is new.
   - Her resource page links a starter repo for project 1 (Abhishek Veeramalla's "AI-Assisted DevOps" Day 3) and one for project 5 (adityonugrohoid/gpu-autoscale-inference). If you want to point viewers to them, credit those creators in the description.
2. **Corrections to the source:**
   - The KV cache is explained correctly.
   - "Time per output token" is folded into inter-token latency, because vLLM renamed it.
   - The cold start is about ten minutes before tuning, not "several minutes".
   - The router is named as the production-stack router, with llm-d added.
   - Kubernetes isn't called "stateful" for vLLM.
3. **New facts and numbers, all sourced:**
   - the AWS GPU prices and the idle-bill math;
   - the posted salary range;
   - the 7B memory math and the Ollama download sizes;
   - llmfit;
   - the official vLLM image size;
   - the BentoML cold start;
   - the AWS weight-streaming result;
   - the KEDA and Cluster Autoscaler scale-down waits;
   - the managed scale-to-zero options;
   - vLLM's CPU version;
   - the three-hour GPU test cost.
4. **"Let's say" math I wrote,** not data: latency versus throughput, the KServe replica math, the ten-to-three-minute cold start, and the 44 cents per million tokens.
5. **Ideas I added:**
   - the three-try limit and the scorecard in project 1;
   - k6 and Locust as load testing tools;
   - Argo CD and Loki as named examples;
   - the data engineer line in project 5;
   - "measure each part before you fix anything";
   - the results table and the "why that tool?" follow-up.
6. **Your hiring voice.** Part 4 is written as your experience: "a project only helps you if you can talk about it with numbers". Please confirm it matches what you've seen.
7. **Dropped from the source:**
   - her own channel and newsletter references;
   - the "inference crash course" plugs;
   - "I'm aware not everyone has GPUs";
   - the closing line about job seekers, career switchers and people already working on inference.
8. **Length.** The source runs 15 minutes at about 200 words a minute, which is about 3,050 words. At your pace, the same content takes about 20 minutes, and this script is about 21. To get to about 18 minutes, cut these, which saves about 380 words:
   - the salary card in Part 1;
   - the DevOps paragraph in Part 1;
   - "Then break things on purpose" in project 3;
   - the latency math and Graphic 8 (keep the continuous batching line);
   - the "Going to zero takes time too" paragraph;
   - the three-hour GPU test in Part 3;
   - the cost-per-million-tokens math in Part 4 (keep the results table).
10. **Rhythm check:** `skills/hormozi-style/scripts/style_check.py` on the spoken script gives a median sentence of 15 words, 9% short lines, 27% long sentences and no clichés, all inside the target bands. Contractions are 2.1 per 100 words, at the low end of the band.
9. **No company names for you.** Companies appear only as sources (AWS, BentoML, the AI labs' postings) and as tools. Nothing mentions where you work.
